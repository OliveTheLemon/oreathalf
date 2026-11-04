"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  createMealPoster,
  downloadMealPoster,
  imageSizes,
  mealTypes,
  type ImageSize,
  type MealType,
} from "@/components/whatiatetoday/mealPoster";
import {
  useMealJournal,
  type MealDraft,
  type MealEntry,
} from "@/components/whatiatetoday/useMealJournal";

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return getLocalDateKey(date);
}

function formatDate(dateKey: string) {
  if (!dateKey) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function createEmptyDraft(meal: MealType): MealDraft {
  return {
    meal,
    time: new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()),
    food: "",
    note: "",
    eatHalf: false,
  };
}

export function WhatIAteToday() {
  const [selectedDate, setSelectedDate] = useState("");
  const [draft, setDraft] = useState<MealDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize>("1080x1350");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<{
    url: string;
    blob: Blob;
    dateKey: string;
    imageSize: ImageSize;
  } | null>(null);
  const [imageMessage, setImageMessage] = useState("");
  const [journalMessage, setJournalMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const journal = useMealJournal(selectedDate);

  useEffect(() => {
    setSelectedDate(getLocalDateKey(new Date()));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("auth") !== "error") return;

    setIsAuthDialogOpen(true);
    setJournalMessage("로그인 링크가 만료되었거나 이미 사용되었습니다. 새 링크를 요청해 주세요.");
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", url.toString());
  }, []);

  useEffect(() => {
    if (!receiptPreview) return;
    return () => URL.revokeObjectURL(receiptPreview.url);
  }, [receiptPreview]);

  const entries = journal.entries;
  const todayKey = selectedDate ? getLocalDateKey(new Date()) : "";

  const createImage = async () => {
    setIsGeneratingImage(true);
    setReceiptPreview(null);
    setImageMessage("");
    try {
      const imageBlob = await createMealPoster(
        selectedDate,
        entries,
        imageSize,
      );
      setReceiptPreview({
        url: URL.createObjectURL(imageBlob),
        blob: imageBlob,
        dateKey: selectedDate,
        imageSize,
      });
      setImageMessage("영수증 아래 버튼을 눌러 이미지를 저장하세요.");
    } catch {
      setImageMessage("이미지를 만들지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const saveReceiptImage = () => {
    if (!receiptPreview) return;
    downloadMealPoster(
      receiptPreview.blob,
      receiptPreview.dateKey,
      receiptPreview.imageSize,
    );
    setReceiptPreview(null);
    setImageMessage("식단 이미지가 다운로드되었습니다.");
  };

  const openNewEntry = (meal: MealType) => {
    setEditingId(null);
    setDraft(createEmptyDraft(meal));
  };

  const openEditEntry = (entry: MealEntry) => {
    setEditingId(entry.id);
    setDraft({
      meal: entry.meal,
      time: entry.time,
      food: entry.food,
      note: entry.note,
      eatHalf: entry.eatHalf ?? false,
    });
  };

  const saveEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || !draft.food.trim()) return;

    const nextEntry: MealEntry = {
      ...draft,
      id: editingId ?? crypto.randomUUID(),
      food: draft.food.trim(),
      note: draft.note.trim(),
    };

    try {
      await journal.saveEntry(selectedDate, nextEntry);
      setJournalMessage("");
      setDraft(null);
      setEditingId(null);
    } catch (error) {
      setJournalMessage(
        error instanceof Error ? error.message : "기록을 저장하지 못했습니다.",
      );
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      await journal.deleteEntry(selectedDate, entryId);
      setJournalMessage("");
    } catch (error) {
      setJournalMessage(
        error instanceof Error ? error.message : "기록을 삭제하지 못했습니다.",
      );
    }
  };

  const sendMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSendingMagicLink(true);
    setJournalMessage("");

    try {
      await journal.sendMagicLink(email);
      setJournalMessage(
        "로그인 링크를 보냈습니다. 기록을 백업하려면 이 브라우저에서 이메일 링크를 열어 주세요.",
      );
    } catch (error) {
      setJournalMessage(
        error instanceof Error ? error.message : "로그인 링크를 보내지 못했습니다.",
      );
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const signOut = async () => {
    try {
      await journal.signOut();
      setJournalMessage("");
    } catch (error) {
      setJournalMessage(
        error instanceof Error ? error.message : "로그아웃하지 못했습니다.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-[30px] md:pt-[50px]">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-10 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-black pb-7">
          <div>
            <p className="sunflower-medium mb-3 text-sm text-black/55">
              WHAT I ATE TODAY
            </p>
            <h1 className="sunflower-bold text-4xl leading-tight sm:text-6xl">
              오늘 먹은 것
            </h1>
            <p className="mt-3 text-sm text-black/60">
              {formatDate(selectedDate)}
            </p>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              type="button"
              aria-label="전날 보기"
              onClick={() => setSelectedDate((date) => shiftDate(date, -1))}
              className="h-11 w-11 border border-black/25 text-xl transition-colors hover:bg-black hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(todayKey)}
              disabled={!todayKey || selectedDate === todayKey}
              className="h-11 border border-black/25 px-4 text-sm transition-colors hover:bg-black hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              오늘
            </button>
            <button
              type="button"
              aria-label="다음 날 보기"
              disabled={!todayKey || selectedDate >= todayKey}
              onClick={() => setSelectedDate((date) => shiftDate(date, 1))}
              className="h-11 w-11 border border-black/25 text-xl transition-colors hover:bg-black hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px border border-black/15 bg-black/15 sm:grid-cols-4">
          {mealTypes.map((meal, index) => {
            const mealEntries = entries.filter((entry) => entry.meal === meal);
            return (
              <div key={meal} className="bg-background px-4 py-4 sm:px-5">
                <p className="text-xs text-black/50">
                  0{index + 1} / {meal}
                </p>
                <p className="sunflower-bold mt-1 text-2xl">
                  {String(mealEntries.length).padStart(2, "0")}
                  <span className="ml-1 text-xs font-normal text-black/50">
                    기록
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        <section className="mt-12" aria-label="끼니별 기록">
          {mealTypes.map((meal, index) => {
            const mealEntries = entries
              .filter((entry) => entry.meal === meal)
              .sort((first, second) => first.time.localeCompare(second.time));

            return (
              <div
                key={meal}
                className="grid grid-cols-[76px_1fr] gap-4 border-t border-black/20 py-7 sm:grid-cols-[150px_1fr] sm:gap-8"
              >
                <div>
                  <span className="text-xs text-black/45">0{index + 1}</span>
                  <h2 className="sunflower-bold mt-1 text-lg">{meal}</h2>
                </div>
                <div>
                  {journal.mode === "loading" ||
                  journal.mode === "backing-up" ||
                  journal.isLoadingEntries ? (
                    <p className="py-1 text-sm text-black/45" role="status">
                      기록을 불러오는 중이에요
                    </p>
                  ) : journal.isQueryError ? (
                    <p className="py-1 text-sm text-red-700" role="alert">
                      계정 기록을 불러오지 못했어요.
                    </p>
                  ) : mealEntries.length === 0 ? (
                    <p className="py-1 text-sm text-black/35">
                      아직 기록이 없어요
                    </p>
                  ) : (
                    <ul className="divide-y divide-black/10">
                      {mealEntries.map((entry) => (
                        <li
                          key={entry.id}
                          data-testid="meal-entry"
                          data-food={entry.food}
                          className="flex items-start justify-between gap-4 py-3 first:pt-0"
                        >
                          <div className="min-w-0">
                            <p className="sunflower-medium break-words text-base">
                              {entry.food}
                            </p>
                            {entry.eatHalf && (
                              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-[0.1em] text-[#bd402a]">
                                eat half
                              </span>
                            )}
                            {entry.note && (
                              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-black/55">
                                {entry.note}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-3 text-xs text-black/50">
                            <time>{entry.time}</time>
                            <button
                              type="button"
                              aria-label={`${entry.food} 수정`}
                              onClick={() => openEditEntry(entry)}
                              className="underline underline-offset-4 hover:text-black"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              aria-label={`${entry.food} 삭제`}
                              onClick={() => deleteEntry(entry.id)}
                              disabled={journal.isDeletingEntry}
                              className="underline underline-offset-4 hover:text-black"
                            >
                              삭제
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    data-testid="meal-add-entry"
                    onClick={() => openNewEntry(meal)}
                    disabled={journal.mode === "loading" || journal.mode === "backing-up"}
                    className="mt-3 border-b border-black/40 pb-1 text-xs transition-colors hover:border-black hover:text-black/60"
                  >
                    + 기록 추가
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section
          className="mt-12 border-t-2 border-black pt-7"
          aria-label="식단 프린트하기"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase text-black/50">SAVE THE DAY</p>
              <h2 className="sunflower-bold mt-2 text-2xl">하루 식단 이미지</h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="이미지 크기 선택">
              {imageSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={imageSize === size}
                  onClick={() => setImageSize(size)}
                  className={`h-10 border px-3 text-xs transition-colors ${
                    imageSize === size
                      ? "border-black bg-black text-white"
                      : "border-black/25 hover:border-black"
                  }`}
                >
                  {size.replace("x", " × ")}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="button"
              data-testid="meal-create-poster"
              onClick={createImage}
              disabled={isGeneratingImage || entries.length === 0}
              className="bg-[#df583f] px-5 py-3 text-sm text-white transition-colors hover:bg-[#bd402a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGeneratingImage ? "영수증 준비 중..." : "식단 프린트하기 ↓"}
            </button>
            <p aria-live="polite" className="text-xs text-black/55">
              {imageMessage || `${imageSize.replace("x", " × ")} px · PNG`}
            </p>
          </div>
        </section>

        <footer className="mt-8 border-t border-black/20 pt-5 text-xs text-black/55">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {journal.mode === "account" ? (
                <>
                  <p>로그인된 계정에 기록을 저장하고 있습니다.</p>
                  {journal.user?.email && (
                    <p className="mt-1 text-black/40">{journal.user.email}</p>
                  )}
                </>
              ) : journal.mode === "backing-up" ? (
                <p role="status">현재 브라우저 기록을 계정에 백업하고 있습니다.</p>
              ) : journal.mode === "backup-error" ? (
                <p role="alert" className="text-red-700">
                  백업에 실패했습니다. 기록은 이 브라우저에 남아 있습니다.
                  {journal.backupError ? ` (${journal.backupError})` : ""}
                </p>
              ) : journal.mode === "loading" ? (
                <p role="status">기록 저장 상태를 확인하고 있습니다.</p>
              ) : (
                <p>
                  로그인 없이 사용할 수 있으며, 기록은 현재 브라우저에만
                  저장됩니다. 로그인하면 기존 기록을 계정에 백업하고 다른
                  기기에서도 사용할 수 있습니다.
                </p>
              )}
            </div>

            <p>{entries.length}개의 식사 기록</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {journal.mode === "account" ? (
              <button
                type="button"
                onClick={signOut}
                className="underline underline-offset-4"
              >
                로그아웃
              </button>
            ) : journal.mode === "backup-error" ? (
              <button
                type="button"
                onClick={journal.retryBackup}
                className="underline underline-offset-4"
              >
                백업 다시 시도
              </button>
            ) : journal.mode === "guest" && journal.isSupabaseConfigured ? (
              <button
                type="button"
                onClick={() => setIsAuthDialogOpen(true)}
                className="border border-black/30 px-3 py-2 text-black transition-colors hover:bg-black hover:text-white"
              >
                로그인하고 기록 백업
              </button>
            ) : journal.mode === "guest" ? (
              <p className="text-black/40">
                계정 백업은 Supabase 설정 후 사용할 수 있습니다.
              </p>
            ) : null}
          </div>

          {journalMessage && (
            <p className="mt-3" role="status">
              {journalMessage}
            </p>
          )}
        </footer>
      </div>

      {isAuthDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsAuthDialogOpen(false);
            }
          }}
        >
          <form
            onSubmit={sendMagicLink}
            className="w-full max-w-md border border-black bg-background p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meal-account-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-black/50">BACK UP YOUR JOURNAL</p>
                <h2
                  id="meal-account-title"
                  className="sunflower-bold mt-2 text-2xl"
                >
                  로그인하고 기록 백업
                </h2>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsAuthDialogOpen(false)}
                className="h-9 w-9 text-xl hover:bg-black/5"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-black/60">
              이메일로 매직링크를 보내드립니다. 기존 기록을 백업하려면 링크를
              요청한 이 브라우저에서 열어 주세요. 처음 사용하는 이메일은
              계정이 자동으로 만들어집니다.
            </p>

            <label className="mt-6 block text-xs text-black/60">
              이메일
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-12 w-full border border-black/25 bg-white px-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
              />
            </label>

            {journalMessage && (
              <p className="mt-3 text-sm text-black/65" role="status">
                {journalMessage}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAuthDialogOpen(false)}
                className="border border-black/25 px-5 py-3 text-sm hover:border-black"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSendingMagicLink || !email.trim()}
                className="bg-black px-5 py-3 text-sm text-white transition-colors hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSendingMagicLink ? "보내는 중..." : "매직링크 보내기"}
              </button>
            </div>
          </form>
        </div>
      )}

      {receiptPreview && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-black/55 px-5 py-8"
          role="dialog"
          data-testid="meal-poster-preview"
          aria-modal="true"
          aria-label="식단 영수증 미리보기"
        >
          <Image
            src={receiptPreview.url}
            width={Number(receiptPreview.imageSize.split("x")[0])}
            height={Number(receiptPreview.imageSize.split("x")[1])}
            unoptimized
            data-testid="meal-poster-image"
            alt="오늘의 식단 영수증"
            className="receipt-print-animation h-auto max-h-[72vh] w-auto max-w-[min(82vw,440px)] object-contain shadow-2xl"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              data-testid="meal-poster-download"
              onClick={saveReceiptImage}
              className="bg-[#df583f] px-5 py-3 text-sm text-white transition-colors hover:bg-[#bd402a]"
            >
              이미지 저장하기 ↓
            </button>
            <button
              type="button"
              onClick={() => setReceiptPreview(null)}
              className="border border-white/60 px-5 py-3 text-sm text-white transition-colors hover:bg-white/10"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {draft && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4 py-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDraft(null);
          }}
        >
          <form
            onSubmit={saveEntry}
            className="w-full max-w-lg border border-black bg-background p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-black/50">
                  {formatDate(selectedDate)}
                </p>
                <h2 className="sunflower-bold mt-1 text-2xl">
                  {editingId ? "기록 수정" : "식사 기록"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setDraft(null)}
                className="h-9 w-9 text-xl hover:bg-black/5"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-[1fr_112px] gap-3">
              <label className="text-xs text-black/60">
                끼니
                <select
                  value={draft.meal}
                  onChange={(event) =>
                    setDraft({ ...draft, meal: event.target.value as MealType })
                  }
                  className="mt-2 h-11 w-full border border-black/25 bg-white px-3 text-sm text-black outline-none focus:border-black"
                >
                  {mealTypes.map((meal) => (
                    <option key={meal} value={meal}>
                      {meal}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-black/60">
                시간
                <input
                  type="time"
                  value={draft.time}
                  onChange={(event) =>
                    setDraft({ ...draft, time: event.target.value })
                  }
                  className="mt-2 h-11 w-full border border-black/25 bg-white px-3 text-sm text-black outline-none focus:border-black"
                />
              </label>
            </div>

            <label className="mt-5 block text-xs text-black/60">
              먹은 음식
              <input
                data-testid="meal-food-input"
                autoFocus
                required
                maxLength={120}
                value={draft.food}
                onChange={(event) =>
                  setDraft({ ...draft, food: event.target.value })
                }
                placeholder="예: 현미밥, 된장국, 구운 두부"
                className="mt-2 h-12 w-full border border-black/25 bg-white px-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
              />
            </label>

            <label className="mt-5 block text-xs text-black/60">
              메모 <span className="text-black/35">선택</span>
              <textarea
                rows={3}
                maxLength={300}
                value={draft.note}
                onChange={(event) =>
                  setDraft({ ...draft, note: event.target.value })
                }
                placeholder="양이나 먹을 때의 기분을 적어보세요"
                className="mt-2 w-full resize-y border border-black/25 bg-white px-3 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
              />
            </label>

            <label className="mt-5 flex cursor-pointer items-center gap-3 border border-black/15 bg-white/60 p-4 text-sm">
              <input
                type="checkbox"
                checked={draft.eatHalf}
                onChange={(event) =>
                  setDraft({ ...draft, eatHalf: event.target.checked })
                }
                className="h-5 w-5 accent-[#df583f]"
              />
              <span>
                <span className="sunflower-bold block">eat half</span>
                <span className="mt-1 block text-xs text-black/50">
                  이 음식은 절반만 먹었어요
                </span>
              </span>
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="border border-black/25 px-5 py-3 text-sm hover:border-black"
              >
                취소
              </button>
              <button
                type="submit"
                data-testid="meal-save-entry"
                disabled={
                  journal.isSavingEntry ||
                  journal.mode === "loading" ||
                  journal.mode === "backing-up"
                }
                className="bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {journal.isSavingEntry ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
