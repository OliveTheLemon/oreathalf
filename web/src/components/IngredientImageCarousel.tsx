"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { IngredientImageGroup } from "@/sanity/queries";

// 같은 재료 번호의 사진들이 같은 칸 안에서 3초마다 순환되도록 보여주기 위해
// 클라이언트에서 현재 인덱스를 관리하는 컴포넌트입니다.
function getSanityImageSrc(url: string | undefined, width: number) {
  if (!url) {
    return "";
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

export function IngredientImageCarousel({
  group,
}: {
  group: IngredientImageGroup;
}) {
  // 같은 재료의 사진들 중 무엇을 현재 보여줄지 인덱스로 관리합니다.
  const [activeIndex, setActiveIndex] = useState(0);

  // 3초마다 다음 이미지로 바뀌도록 인터벌을 설정합니다.
  useEffect(() => {
    if (group.images.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex(
        (currentIndex) => (currentIndex + 1) % group.images.length,
      );
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [group.images.length]);

  // 현재 인덱스에 해당하는 이미지 하나만 선택해 표시합니다.
  const currentImage = group.images[activeIndex];

  if (!currentImage?.image?.asset?.url) {
    return null;
  }

  const optimizedImageUrl = getSanityImageSrc(
    currentImage.image.asset.url,
    800,
  );
  const altText = currentImage.image.alt || currentImage.title || "재료 이미지";

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden sm:aspect-[9/8] md:aspect-[9/8] lg:aspect-[9/8]">
      <Image
        src={optimizedImageUrl}
        alt={altText}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        loading="lazy"
        className="object-cover"
      />
    </div>
  );
}
