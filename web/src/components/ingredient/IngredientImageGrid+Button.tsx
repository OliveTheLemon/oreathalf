"use client";

import Image from "next/image";
import { useState } from "react";
import type { IngredientImageGroup } from "@/sanity/queries";

const filterModes = [
  { label: "전체", category: null },
  { label: "재료", category: 0 },
  { label: "요리", category: 1 },
  { label: "디자인", category: 2 },
] as const;
const filterStateNames = ["all", "ingredient", "dish", "design"] as const;

export function IngredientFilterButton({
  filterIndex,
  onSelect,
}: {
  filterIndex: number;
  onSelect: (index: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeMode = filterModes[filterIndex];

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {isExpanded && (
        <div
          aria-label="이미지 필터"
          className="absolute bottom-16 right-0 flex flex-col gap-2"
        >
          {filterModes.map((mode, index) => (
            <button
              key={mode.label}
              type="button"
              data-testid={`ingredient-filter-option-${filterStateNames[index]}`}
              aria-pressed={filterIndex === index}
              onClick={() => {
                onSelect(index);
                setIsExpanded(false);
              }}
              className={`flex w-full items-center justify-center rounded-full px-3 py-3 text-sm shadow-lg sunflower-light ${
                filterIndex === index
                  ? "bg-amber-500 font-bold text-white sunflower-medium"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span className="whitespace-nowrap">{mode.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        data-testid="ingredient-filter-toggle"
        data-filter-state={filterStateNames[filterIndex]}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl leading-none text-neutral-800 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
        aria-label={
          isExpanded ? "필터 메뉴 닫기" : `${activeMode.label} 필터 메뉴 열기`
        }
        aria-expanded={isExpanded}
        title="이미지 필터"
      >
        <span aria-hidden="true">{isExpanded ? "×" : "+"}</span>
      </button>
    </div>
  );
}

function getSanityImageSrc(url: string | undefined, width: number) {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

export function IngredientImageGrid({
  group,
  filterIndex = 0,
}: {
  group: IngredientImageGroup;
  filterIndex?: number;
}) {
  const activeMode = filterModes[filterIndex];
  const images = group.images.filter(
    (image) =>
      (activeMode.category === null ||
        image.category === activeMode.category) &&
      Boolean(image.image?.asset?.url),
  );

  return (
    <>
      <div
        data-testid="ingredient-image-grid"
        className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 pt-[50px] md:pt-[100px]"
      >
        {images.length === 0 ? (
          <p className="col-span-full py-20 text-center text-neutral-500 sunflower-medium">
            이미지 없음
          </p>
        ) : (
          images.map((imageItem) => {
            const imageUrl = imageItem.image?.asset?.url;
            const optimizedUrl = getSanityImageSrc(imageUrl, 800);
            const altText =
              imageItem.image?.alt || imageItem.title || "재료 이미지";

            return (
              <div
                key={imageItem._id}
                data-testid="ingredient-image"
                data-category={imageItem.category ?? ""}
                className="relative transition-transform duration-500 ease-in-out hover:z-10 hover:scale-[1.2]"
              >
                {optimizedUrl ? (
                  <div className="relative aspect-[9/16] w-full sm:aspect-square md:aspect-square lg:aspect-square">
                    {imageItem.istgUrl ? (
                      <a
                        href={imageItem.istgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="relative block h-full"
                      >
                        <Image
                          src={optimizedUrl}
                          alt={altText}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-2 top-2 z-7 rounded-full bg-neutral-500/50 p-1.5 text-white shadow-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                        </span>
                      </a>
                    ) : (
                      <Image
                        src={optimizedUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
