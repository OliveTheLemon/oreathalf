"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type MealType = "아침" | "점심" | "저녁" | "간식";

type MealEntry = {
  id: string;
  meal: MealType;
  time: string;
  food: string;
  note: string;
  eatHalf: boolean;
};

type MealDraft = Omit<MealEntry, "id">;
type ImageSize = "1080x1920" | "1080x1350" | "1080x1080";

const imageSizes: ImageSize[] = ["1080x1920", "1080x1350", "1080x1080"];

const mealTypes: MealType[] = ["아침", "점심", "저녁", "간식"];
const storageKey = "oreathalf-meal-journal-v1";

function drawPosterText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  let line = "";
  let lineCount = 0;
  const lines: string[] = [];

  for (const character of Array.from(text)) {
    const nextLine = line + character;
    if (line && context.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = character;
    } else {
      line = nextLine;
    }
  }
  if (line) lines.push(line);

  const lineHeight = 48;
  for (const textLine of lines) {
    context.fillText(textLine, x, y + lineCount * lineHeight);
    lineCount += 1;
    if (lineCount === 2) break;
  }

  return lineCount;
}

async function downloadMealPoster(
  dateKey: string,
  entries: MealEntry[],
  imageSize: ImageSize,
) {
  await document.fonts.ready;

  const [width, height] = imageSize.split("x").map(Number);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이미지 캔버스를 만들 수 없습니다.");

  context.fillStyle = "#fff3cd";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#df583f";
  context.fillRect(0, 0, width, 18);

  const compact = height === 1080;
  const margin = 78;
  const contentTop = compact ? 300 : height === 1350 ? 330 : 390;
  const footerTop = height - 105;
  const sectionHeight = (footerTop - contentTop) / mealTypes.length;

  context.fillStyle = "#1f1f1f";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = "700 25px 'Iosevka Charon Mono', monospace";
  context.fillText("OREATHALF  /  FOOD JOURNAL", margin, 88);
  context.font = `700 ${compact ? 68 : 88}px Sunflower, sans-serif`;
  context.fillText("오늘 먹은 것", margin, compact ? 174 : 205);
  context.font = "400 27px 'Iosevka Charon Mono', monospace";
  context.fillStyle = "#5d5748";
  context.fillText(formatDate(dateKey), margin, compact ? 220 : 263);

  context.strokeStyle = "#1f1f1f";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(margin, compact ? 248 : 300);
  context.lineTo(width - margin, compact ? 248 : 300);
  context.stroke();

  mealTypes.forEach((meal, index) => {
    const top = contentTop + index * sectionHeight;
    const mealEntries = entries
      .filter((entry) => entry.meal === meal)
      .sort((first, second) => first.time.localeCompare(second.time));
    context.strokeStyle = "rgba(31, 31, 31, 0.22)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(margin, top);
    context.lineTo(width - margin, top);
    context.stroke();

    context.fillStyle = "#1f1f1f";
    context.font = "700 22px 'Iosevka Charon Mono', monospace";
    context.fillText(`0${index + 1}`, margin, top + 38);
    context.font = "700 38px Sunflower, sans-serif";
    context.fillText(meal, margin + 62, top + 42);

    const rowHeight = compact ? 45 : 52;
    const rowCapacity = Math.max(
      1,
      Math.floor((sectionHeight - 78) / rowHeight),
    );
    const visibleEntries = mealEntries.slice(0, rowCapacity);

    if (visibleEntries.length === 0) {
      context.fillStyle = "#77705f";
      context.font = "400 24px Sunflower, sans-serif";
      context.fillText("아직 기록이 없어요", margin + 62, top + 86);
    } else {
      visibleEntries.forEach((entry, entryIndex) => {
        const rowTop = top + 88 + entryIndex * rowHeight;
        context.fillStyle = "#1f1f1f";
        context.font = "500 26px Sunflower, sans-serif";
        drawPosterText(context, entry.food, margin + 62, rowTop, width - 270);
        context.textAlign = "right";
        context.fillStyle = entry.eatHalf ? "#df583f" : "#77705f";
        context.font = "400 20px 'Iosevka Charon Mono', monospace";
        context.fillText(
          `${entry.time}  ·  ${entry.eatHalf ? "EAT HALF" : ""}`,
          width - margin,
          rowTop,
        );
        context.textAlign = "left";
      });
      if (mealEntries.length > visibleEntries.length) {
        context.fillStyle = "#77705f";
        context.font = "400 18px 'Iosevka Charon Mono', monospace";
        context.fillText(
          `+ ${mealEntries.length - visibleEntries.length} MORE`,
          margin + 62,
          top + 88 + visibleEntries.length * rowHeight,
        );
      }
    }
  });

  context.strokeStyle = "#1f1f1f";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(margin, footerTop);
  context.lineTo(width - margin, footerTop);
  context.stroke();
  context.fillStyle = "#1f1f1f";
  context.font = "700 21px 'Iosevka Charon Mono', monospace";
  context.fillText("or.....EAT HALF!", margin, height - 57);
  context.textAlign = "right";
  context.font = "400 18px 'Iosevka Charon Mono', monospace";
  context.fillText(`${entries.length} MEALS`, width - margin, height - 57);
  context.textAlign = "left";

  const imageBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("이미지 파일을 만들지 못했습니다."));
    }, "image/png");
  });
  const imageUrl = URL.createObjectURL(imageBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = `oreathalf-${dateKey}-${width}x${height}.png`;
  downloadLink.click();
  URL.revokeObjectURL(imageUrl);
}

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
  const [entriesByDate, setEntriesByDate] = useState<
    Record<string, MealEntry[]>
  >({});
  const [isReady, setIsReady] = useState(false);
  const [draft, setDraft] = useState<MealDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize>("1080x1350");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageMessage, setImageMessage] = useState("");

  useEffect(() => {
    setSelectedDate(getLocalDateKey(new Date()));
    try {
      const savedEntries = window.localStorage.getItem(storageKey);
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries) as Record<
          string,
          MealEntry[]
        >;
        if (parsedEntries && typeof parsedEntries === "object") {
          setEntriesByDate(parsedEntries);
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(storageKey, JSON.stringify(entriesByDate));
    }
  }, [entriesByDate, isReady]);

  const entries = entriesByDate[selectedDate] ?? [];
  const todayKey = isReady ? getLocalDateKey(new Date()) : "";

  const createImage = async () => {
    setIsGeneratingImage(true);
    setImageMessage("");
    try {
      await downloadMealPoster(selectedDate, entries, imageSize);
      setImageMessage("식단 이미지가 다운로드되었습니다.");
    } catch {
      setImageMessage("이미지를 만들지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsGeneratingImage(false);
    }
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

  const saveEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || !draft.food.trim()) return;

    setEntriesByDate((current) => {
      const currentEntries = current[selectedDate] ?? [];
      const nextEntry = {
        ...draft,
        food: draft.food.trim(),
        note: draft.note.trim(),
      };
      const nextEntries = editingId
        ? currentEntries.map((entry) =>
            entry.id === editingId
              ? { ...entry, ...nextEntry, eatHalf: draft.eatHalf }
              : entry,
          )
        : [...currentEntries, { ...nextEntry, id: crypto.randomUUID() }];

      return { ...current, [selectedDate]: nextEntries };
    });
    setDraft(null);
    setEditingId(null);
  };

  const deleteEntry = (entryId: string) => {
    setEntriesByDate((current) => ({
      ...current,
      [selectedDate]: (current[selectedDate] ?? []).filter(
        (entry) => entry.id !== entryId,
      ),
    }));
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-black/15 px-5 py-4 sm:px-10">
        <Link href="/" className="sunflower-bold text-sm sm:text-base">
          or.....EAT HALF!
        </Link>
        <span className="text-xs uppercase tracking-[0.12em] text-black/55">
          food journal / 01
        </span>
      </header>

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
                  {mealEntries.length === 0 ? (
                    <p className="py-1 text-sm text-black/35">
                      아직 기록이 없어요
                    </p>
                  ) : (
                    <ul className="divide-y divide-black/10">
                      {mealEntries.map((entry) => (
                        <li
                          key={entry.id}
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
                    onClick={() => openNewEntry(meal)}
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
          aria-label="식단 이미지 만들기"
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
              onClick={createImage}
              disabled={isGeneratingImage || entries.length === 0}
              className="bg-[#df583f] px-5 py-3 text-sm text-white transition-colors hover:bg-[#bd402a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGeneratingImage
                ? "이미지 만드는 중..."
                : "식단 이미지 만들기 ↓"}
            </button>
            <p aria-live="polite" className="text-xs text-black/55">
              {imageMessage || `${imageSize.replace("x", " × ")} px · PNG`}
            </p>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/20 pt-5 text-xs text-black/50">
          <p>기록은 이 브라우저에 저장됩니다.</p>
          <p>{entries.length}개의 식사 기록</p>
        </footer>
      </div>

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
                className="bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-black/75"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
