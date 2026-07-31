"use client";

import { useState, useEffect } from "react";

type InteractiveTitleProps = {
  englishText: string;
  koreanText: string;
};

export function InteractiveBigTitle({
  englishText,
  koreanText,
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
        className="relative inline-block text-3xl font-semibold text-[#1f1f1f] md:text-6xl"
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* 영어 */}
        <span
          className={`block transition-all duration-200 ease-out pt-8 ${
            isHovered ? "opacity-0" : "opacity-100"
          } font-iosevka-charon-mono`}
        >
          {englishText}
        </span>

        {/* 한국어 (마우스오버) */}
        <span
          className={`absolute inset-0 block ransition-all duration-200 ease-out pt-8 ${
            isHovered ? "opacity-100" : "opacity-0"
          } font-designhouse`}
        >
          {koreanText}
        </span>
      </h1>
    </div>
  );
}
