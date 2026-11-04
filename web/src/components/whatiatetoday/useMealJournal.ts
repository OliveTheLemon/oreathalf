import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import type { MealType } from "@/components/whatiatetoday/mealPoster";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type MealEntry = {
  id: string;
  meal: MealType;
  time: string;
  food: string;
  note: string;
  eatHalf: boolean;
};

export type MealDraft = Omit<MealEntry, "id">;
export type MealEntriesByDate = Record<string, MealEntry[]>;
export type MealJournalMode =
  | "loading"
  | "guest"
  | "backing-up"
  | "account"
  | "backup-error";

const storageKey = "oreathalf-meal-journal-v1";
const queryKey = (userId: string, dateKey: string) =>
  ["meal-entries", userId, dateKey] as const;

type MealEntryRow = {
  id: string;
  meal_type: MealType;
  eaten_at: string;
  food: string;
  note: string;
  eat_half: boolean;
};

function readLocalEntries(): MealEntriesByDate {
  const savedEntries = window.localStorage.getItem(storageKey);
  if (!savedEntries) return {};

  const parsedEntries = JSON.parse(savedEntries) as MealEntriesByDate;
  if (
    !parsedEntries ||
    typeof parsedEntries !== "object" ||
    Array.isArray(parsedEntries)
  ) {
    throw new Error("저장된 식단 기록 형식이 올바르지 않습니다.");
  }

  return Object.fromEntries(
    Object.entries(parsedEntries).filter(
      ([dateKey, entries]) =>
        /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && Array.isArray(entries),
    ),
  );
}

function toDatabaseTime(time: string) {
  return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
}

function fromDatabaseRow(row: MealEntryRow): MealEntry {
  return {
    id: row.id,
    meal: row.meal_type,
    time: row.eaten_at.slice(0, 5),
    food: row.food,
    note: row.note,
    eatHalf: row.eat_half,
  };
}

export function useMealJournal(dateKey: string) {
  const queryClient = useQueryClient();
  const [localEntriesByDate, setLocalEntriesByDate] =
    useState<MealEntriesByDate>({});
  const localEntriesRef = useRef(localEntriesByDate);
  localEntriesRef.current = localEntriesByDate;

  const [localReady, setLocalReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [supabase, setSupabase] = useState<
    ReturnType<typeof createSupabaseBrowserClient> | null
  >(null);
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<MealJournalMode>("loading");
  const [backupError, setBackupError] = useState("");
  const [backupAttempt, setBackupAttempt] = useState(0);
  const migratedUserId = useRef<string | null>(null);
  const userId = user?.id ?? null;

  useEffect(() => {
    try {
      setLocalEntriesByDate(readLocalEntries());
    } catch {
      window.localStorage.removeItem(storageKey);
      setLocalEntriesByDate({});
    }
    setLocalReady(true);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return;
    }

    const client = createSupabaseBrowserClient();
    setSupabase(client);

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        setUser(data.session?.user ?? null);
        setAuthReady(true);
      })
      .catch(() => {
        setUser(null);
        setAuthReady(true);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!localReady || !authReady) return;

    if (!userId) {
      migratedUserId.current = null;
      setMode("guest");
      return;
    }

    if (migratedUserId.current === userId) {
      setMode("account");
      return;
    }

    if (!supabase) return;

    let cancelled = false;
    setMode("backing-up");
    setBackupError("");

    void (async () => {
      const rows = Object.entries(localEntriesRef.current).flatMap(
        ([date, entries]) =>
          entries.map((entry) => ({
            id: entry.id,
            user_id: userId,
            eaten_on: date,
            meal_type: entry.meal,
            eaten_at: toDatabaseTime(entry.time),
            food: entry.food,
            note: entry.note,
            eat_half: entry.eatHalf ?? false,
          })),
      );

      for (let index = 0; index < rows.length; index += 100) {
        const { error } = await supabase
          .from("meal_entries")
          .upsert(rows.slice(index, index + 100), {
            onConflict: "id",
            ignoreDuplicates: true,
          });
        if (error) throw error;
      }

      if (cancelled) return;

      if (rows.length > 0) {
        window.localStorage.removeItem(storageKey);
        setLocalEntriesByDate({});
      }

      migratedUserId.current = userId;
      setMode("account");
      await queryClient.invalidateQueries({
        queryKey: ["meal-entries", userId],
      });
    })().catch((error: unknown) => {
      if (cancelled) return;
      setBackupError(
        error instanceof Error
          ? error.message
          : "기록을 계정에 백업하지 못했습니다.",
      );
      setMode("backup-error");
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, backupAttempt, localReady, queryClient, supabase, userId]);

  useEffect(() => {
    if (
      !localReady ||
      !authReady ||
      (mode !== "guest" && mode !== "backup-error")
    ) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(localEntriesByDate),
    );
  }, [authReady, localEntriesByDate, localReady, mode]);

  const remoteEntries = useQuery({
    queryKey: queryKey(userId ?? "", dateKey),
    enabled: Boolean(
      supabase && userId && mode === "account" && dateKey,
    ),
    queryFn: async () => {
      if (!supabase || !userId) throw new Error("로그인이 필요합니다.");

      const { data, error } = await supabase
        .from("meal_entries")
        .select("id, meal_type, eaten_at, food, note, eat_half")
        .eq("eaten_on", dateKey)
        .order("meal_type")
        .order("eaten_at")
        .order("created_at");

      if (error) throw error;
      return (data ?? []).map((row) => fromDatabaseRow(row as MealEntryRow));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      entry,
      date,
      userId: ownerId,
    }: {
      entry: MealEntry;
      date: string;
      userId: string;
    }) => {
      if (!supabase) throw new Error("로그인이 필요합니다.");

      const { error } = await supabase.from("meal_entries").upsert(
        {
          id: entry.id,
          user_id: ownerId,
          eaten_on: date,
          meal_type: entry.meal,
          eaten_at: toDatabaseTime(entry.time),
          food: entry.food,
          note: entry.note,
          eat_half: entry.eatHalf,
        },
        { onConflict: "id" },
      );

      if (error) throw error;
    },
    onSuccess: (_result, { date, userId: ownerId }) =>
      queryClient.invalidateQueries({ queryKey: queryKey(ownerId, date) }),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({
      id,
      date,
      userId: ownerId,
    }: {
      id: string;
      date: string;
      userId: string;
    }) => {
      if (!supabase || !ownerId) throw new Error("로그인이 필요합니다.");

      const { error } = await supabase
        .from("meal_entries")
        .delete()
        .eq("id", id)
        .eq("eaten_on", date);

      if (error) throw error;
    },
    onSuccess: (_result, { date, userId: ownerId }) =>
      queryClient.invalidateQueries({ queryKey: queryKey(ownerId, date) }),
  });

  const saveEntry = useCallback(
    async (date: string, entry: MealEntry) => {
      if (mode === "guest" || mode === "backup-error") {
        setLocalEntriesByDate((current) => {
          const entries = current[date] ?? [];
          const exists = entries.some((currentEntry) => currentEntry.id === entry.id);
          return {
            ...current,
            [date]: exists
              ? entries.map((currentEntry) =>
                  currentEntry.id === entry.id ? entry : currentEntry,
                )
              : [...entries, entry],
          };
        });
        return;
      }

      if (mode !== "account" || !userId) {
        throw new Error("계정 연결이 준비될 때까지 기다려 주세요.");
      }

      await saveMutation.mutateAsync({ entry, date, userId });
    },
    [mode, saveMutation, userId],
  );

  const deleteEntry = useCallback(
    async (date: string, id: string) => {
      if (mode === "guest" || mode === "backup-error") {
        setLocalEntriesByDate((current) => ({
          ...current,
          [date]: (current[date] ?? []).filter((entry) => entry.id !== id),
        }));
        return;
      }

      if (mode !== "account" || !userId) {
        throw new Error("계정 연결이 준비될 때까지 기다려 주세요.");
      }

      await deleteMutation.mutateAsync({ id, date, userId });
    },
    [deleteMutation, mode, userId],
  );

  const sendMagicLink = useCallback(
    async (email: string) => {
      if (!supabase) throw new Error("Supabase 연결 설정이 필요합니다.");

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;

    const currentUserId = user?.id;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    if (currentUserId) {
      queryClient.removeQueries({ queryKey: ["meal-entries", currentUserId] });
    }
  }, [queryClient, supabase, user?.id]);

  const entries =
    mode === "account"
      ? remoteEntries.data ?? []
      : localEntriesByDate[dateKey] ?? [];

  return {
    backupError,
    deleteEntry,
    entries,
    isLoadingEntries: mode === "account" && remoteEntries.isPending,
    isQueryError: mode === "account" && remoteEntries.isError,
    isSavingEntry: saveMutation.isPending,
    isDeletingEntry: deleteMutation.isPending,
    isSupabaseConfigured,
    mode,
    queryError:
      remoteEntries.error instanceof Error ? remoteEntries.error.message : "",
    retryBackup: () => setBackupAttempt((attempt) => attempt + 1),
    saveEntry,
    sendMagicLink,
    signOut,
    user,
  };
}
