"use client";

import { useEffect, useState, type ReactNode } from "react";

type IngredientDetailContentProps = {
  ingredientName: string;
  children: ReactNode;
};

export function IngredientDetailContent({
  ingredientName,
  children,
}: IngredientDetailContentProps) {
  // 커서가 움직일 때마다 이름 배치를 갱신하기 위한 상태입니다.
  const [cursorPosition, setCursorPosition] = useState({ x: 24, y: 24 });

  useEffect(() => {
    // 마우스 이동 이벤트를 감지해 이름 배지가 커서를 따라오도록 합니다.
    const handlePointerMove = (event: MouseEvent) => {
      setCursorPosition({
        x: event.clientX + 16,
        y: event.clientY + 16,
      });
    };

    window.addEventListener("mousemove", handlePointerMove);

    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  return (
    <div className="relative min-h-screen">
      {children}

      {/* 커서 위치를 기준으로 이름을 표시하는 오버레이입니다. */}
      <div
        className="truncate pointer-events-none fixed z-50 border border-black/20 bg-white/80 px-3 py-1 text-sm font-semibold shadow-sm backdrop-blur-sm sunflower-bold"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      >
        {ingredientName}
      </div>
    </div>
  );
}
