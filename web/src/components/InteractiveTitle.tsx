"use client";

import { useState, useEffect } from "react";

export function InteractiveTitle() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;

    const timer = window.setTimeout(() => {
      setIsHovered(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [isHovered]);

  return (
    <h1
      className="relative inline-block text-3xl font-semibold text-[#1f1f1f] md:text-6xl"
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* 영어 */}
      <span
        className={`block whitespace-pre-line transition-all duration-200 ease-out ${
          isHovered ? "opacity-0" : "opacity-100"
        } font-iosevka-charon-mono`}
      >
        {/* {
          "Drink a lot of water\n\nNo breakfast\n\nHealthy lunch\n\nNo carbs dinner\n\nor.....EAT HALF!"
        } */}
        ox.....EXX HXXX!
      </span>

      {/* 한국어 (마우스오버) */}
      <span
        className={`absolute inset-0 block whitespace-pre-line transition-all duration-200 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        } font-designhouse`}
      >
        {/* {
          "물 많이 마시기\n\n아침 공복유지\n\n건강한 점심\n\n탄수화물 없는 저녁\n\n아니면.....절반만 먹기!"
        } */}
        아니면.....반만 먹기!
      </span>
    </h1>
  );
}
