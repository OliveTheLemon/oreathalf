"use client";

import Image from "next/image";
import type { IngredientImageGroup } from "@/sanity/queries";
import oval4 from "@/assets/icons/oval4.svg";
import oval5 from "@/assets/icons/oval5.svg";
import oval6 from "@/assets/icons/oval6.svg";
import oval7 from "@/assets/icons/oval7.svg";

const filterModes = [
  { label: "전체", category: null, icon: oval4 },
  { label: "재료", category: 0, icon: oval5 },
  { label: "요리", category: 1, icon: oval6 },
  { label: "디자인", category: 2, icon: oval7 },
] as const;
const filterStateNames = ["all", "ingredient", "dish", "design"] as const;

export function IngredientFilterButton({
  filterIndex,
  onClick,
}: {
  filterIndex: number;
  onClick: () => void;
}) {
  const activeMode = filterModes[filterIndex];

  return (
    <button
      type="button"
      data-testid="ingredient-filter-toggle"
      data-filter-state={filterStateNames[filterIndex]}
      onClick={onClick}
      className="relative h-10 w-10 transition-transform hover:scale-110"
      aria-label={`${activeMode.label} 필터, 다음 필터로 변경`}
      title={`${activeMode.label} 필터`}
    >
      <Image
        src={activeMode.icon}
        alt={`${activeMode.label} 필터`}
        fill
        sizes="40px"
      />
    </button>
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
      activeMode.category === null || image.category === activeMode.category,
  );

  return (
    <>
      <div
        data-testid="ingredient-image-grid"
        className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 pt-[50px] md:pt-[100px]"
      >
        {images.map((imageItem) => {
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
        })}
      </div>
    </>
  );
}
