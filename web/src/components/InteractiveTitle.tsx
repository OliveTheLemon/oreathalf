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
      <span
        className={`block transition-all duration-150 ease-out ${
          isHovered ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
        } font-iosevka-charon-mono`}
      >
        ox.....EXX HXXX!
      </span>
      <span
        className={`absolute inset-0 block transition-all duration-150 ease-out ${
          isHovered ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        } font-designhouse`}
      >
        아??.....절?? 먹?!
      </span>
    </h1>
  );
}
