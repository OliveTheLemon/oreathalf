"use client";

import { useEffect, useRef, useState } from "react";
import type { IngredientImageGroup } from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";
import { InteractiveBigTitle } from "@/components/InteractiveBigTitle";
import { InteractiveTitle } from "@/components/InteractiveTitle";

type HomePageContentProps = {
  ingredientGroups: IngredientImageGroup[];
};

export function HomePageContent({ ingredientGroups }: HomePageContentProps) {
  // 이미지 그리드 섹션이 화면 상단에 닿았는지 여부를 저장합니다.
  const [shouldStick, setShouldStick] = useState(false);
  // 이미지 그리드 섹션의 DOM 위치를 확인하기 위한 ref입니다.
  const lastTitleSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 스크롤이나 화면 크기 변경 시, 이미지 섹션이 상단에 닿았는지 확인합니다.
    const handleScroll = () => {
      // 1. 태그가 화면에 잘 그려졌는지 확인 (방어 코드)
      if (!lastTitleSectionRef.current) {
        return;
      }

      // 2. 해당 섹션의 현재 위치 파악하기
      const rect = lastTitleSectionRef.current.getBoundingClientRect();
      // 섹션의 top 위치가 화면 상단(0) 이하로 넘어가면 고정 상태로 전환합니다.
      // 3. 마지막 타이틀이 사라졌는지 판별하여 상태 업데이트
      setShouldStick(rect.bottom <= 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {shouldStick ? (
        // 큰 제목이 화면 상단에 붙도록, 이미지 그리드 섹션 바깥에서 독립적으로 sticky 처리합니다.
        <div className="sticky top-0 z-20 bg-background/90 py-2">
          <InteractiveBigTitle
            englishText={"or.....EAT HALF!"}
            koreanText={"아니면.....절반만 먹기!"}
            isPinned={shouldStick}
          />
        </div>
      ) : null}

      {/* 상단 문구 영역: 여러 줄의 인터랙티브 제목을 보여줍니다. */}
      <section className="flex min-h-screen flex-col justify-center">
        <InteractiveTitle
          englishText={"Drink a lot of water"}
          koreanText={"물 많이 마시기"}
          alignment="right-third"
        />
        <InteractiveTitle
          englishText={"No breakfast"}
          koreanText={"아침 공복유지"}
          alignment="left-third"
        />
        <InteractiveTitle
          englishText={"Healthy lunch"}
          koreanText={"건강한 점심"}
          alignment="right-third"
        />
        <InteractiveTitle
          englishText={"No carbs dinner"}
          koreanText={"탄수화물 없는 저녁"}
          alignment="left-third"
        />
        <section ref={lastTitleSectionRef}>
          <InteractiveBigTitle
            englishText={"or.....EAT HALF!"}
            koreanText={"아니면.....절반만 먹기!"}
          />
        </section>
      </section>

      {/* 이미지 그리드 영역: 이 섹션이 화면 상단에 닿으면 큰 제목이 고정됩니다. */}
      <section className="mx-auto px-2 pb-12">
        {/* 재료 이미지 카드들을 격자 형태로 배치합니다. */}
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {ingredientGroups.map((group) => (
            <IngredientImageCarousel key={group.ingredientId} group={group} />
          ))}
        </div>
      </section>
    </main>
  );
}
