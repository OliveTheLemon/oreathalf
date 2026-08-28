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
      <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((imageItem) => {
          const imageUrl = imageItem.image?.asset?.url;
          const optimizedUrl = getSanityImageSrc(imageUrl, 800);
          const altText =
            imageItem.image?.alt || imageItem.title || "재료 이미지";

          return (
            <div
              key={imageItem._id}
              className="relative transition-transform duration-500 ease-in-out hover:z-10 hover:scale-[1.2]"
            >
              {optimizedUrl ? (
                <div className="relative aspect-[9/16] w-full sm:aspect-[9/8] md:aspect-[9/8] lg:aspect-[9/8]">
                  {imageItem.istgUrl ? (
                    <a
                      href={imageItem.istgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full"
                    >
                      <Image
                        src={optimizedUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover"
                      />
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
