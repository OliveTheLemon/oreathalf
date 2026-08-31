"use client";

import { useState, useEffect } from "react";

type InteractiveTitleProps = {
  englishText: string;
  koreanText: string;
  isPinned?: boolean;
};

export function InteractiveBigTitle({
  englishText,
  koreanText,
  isPinned = false,
}: InteractiveTitleProps) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;

    const timer = window.setTimeout(() => {
      setIsHovered(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [isHovered]);

  return (
    <div className="flex w-full justify-center">
      <h1
        className={`relative inline-block text-3xl font-semibold transition-colors duration-200 md:text-6xl ${
          // 고정 상태에서는 이미지 카드와 대비되도록 명시적인 밝은 색을 사용합니다.
          isPinned ? "text-background" : "text-foreground"
        }`}
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* 영어 */}
        <span
          className={`whitespace-nowrap block transition-all duration-200 ease-out py-4 ${
            isHovered ? "opacity-0" : "opacity-100"
          } iosevka-charon-bold`}
        >
          {englishText}
        </span>

        {/* 한국어 (마우스오버) */}
        <span
          className={`whitespace-nowrap absolute inset-0 block ransition-all duration-200 ease-out py-4 ${
            isHovered ? "opacity-100" : "opacity-0"
          } sunflower-bold`}
        >
          {koreanText}
        </span>
      </h1>
    </div>
  );
}
