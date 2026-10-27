"use client";

import Image from "next/image";
import Link from "next/link";
import type { IngredientHoverImageGroup } from "@/sanity/queries";

function getSanityImageSrc(url: string | undefined, width: number) {
  if (!url) {
    return "";
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

export function IngredientImageHover({
  group,
}: {
  group: IngredientHoverImageGroup;
}) {
  const [firstImage, secondImage] = group.imageIds.map((imageId) =>
    group.images.find((image) => image._id === imageId),
  );

  if (!firstImage?.image?.asset?.url) {
    return null;
  }

  const firstImageUrl = getSanityImageSrc(firstImage.image.asset.url, 800);
  const secondImageUrl = getSanityImageSrc(secondImage?.image?.asset?.url, 800);

  return (
    <Link
      href={`/ingredient/${group.ingredientNumber}`}
      className="group relative block aspect-[9/16] w-full overflow-hidden sm:aspect-square md:aspect-square lg:aspect-square"
      aria-label={`${firstImage.title ?? "재료"} 이미지 모아보기`}
    >
      <Image
        src={firstImageUrl}
        alt={firstImage.image?.alt || firstImage.title || "재료 이미지"}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        loading="lazy"
        className="object-cover"
      />
      {secondImageUrl && (
        <Image
          src={secondImageUrl}
          alt={secondImage?.image?.alt || secondImage?.title || "재료 이미지"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      )}
    </Link>
  );
}
