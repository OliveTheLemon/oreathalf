"use client";

import { useState, useEffect } from "react";

type InteractiveTitleProps = {
  englishText: string;
  koreanText: string;
  alignment?: "left-third" | "right-third" | "center";
};

const alignmentClassMap = {
  "left-third": "justify-start pl-[45vw]",
  "right-third": "justify-end pr-[33vw] md:pr-[40vw]",
  center: "justify-center",
} as const;

export function InteractiveTitle({
  englishText,
  koreanText,
  alignment = "center",
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
    <div className={`flex w-full ${alignmentClassMap[alignment]}`}>
      <h1
        className="relative inline-block text-2xl font-semibold text-foreground md:text-5xl"
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* 영어 */}
        <span
          className={`whitespace-nowrap block transition-all duration-200 ease-out py-6 ${
            isHovered ? "opacity-0" : "opacity-100"
          } font-iosevka-charon-mono`}
        >
          {englishText}
        </span>

        {/* 한국어 (마우스오버) */}
        <span
          className={`whitespace-nowrap absolute inset-0 block transition-all duration-200 ease-out py-6 ${
            isHovered ? "opacity-100" : "opacity-0"
          } font-designhouse`}
        >
          {koreanText}
        </span>
      </h1>
    </div>
  );
}
