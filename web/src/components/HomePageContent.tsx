"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type {
  IngredientHoverImageGroup,
  IngredientImageGroup,
  SanityImageItem,
} from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";
import { IngredientImageHover } from "@/components/IngredientImageHover";
import { InteractiveBigTitle } from "@/components/InteractiveBigTitle";
import { InteractiveTitle } from "@/components/InteractiveTitle";

type HomePageContentProps = {
  ingredientGroups: IngredientImageGroup[];
  hoverImageGroups: IngredientHoverImageGroup[];
  popupImage?: SanityImageItem | null;
};

function getSanityImageSrc(url: string | undefined, width: number) {
  if (!url) {
    return "";
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

export function HomePageContent({
  ingredientGroups,
  hoverImageGroups,
  popupImage,
}: HomePageContentProps) {
  const [shouldStick, setShouldStick] = useState(false);
  const lastTitleSectionRef = useRef<HTMLElement | null>(null);
  // const [imageGridTop, setImageGridTop] = useState(false);
  const imageGridSectionRef = useRef<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hideForToday, setHideForToday] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!lastTitleSectionRef.current) {
        return;
      }
      if (!imageGridSectionRef.current) {
        return;
      }

      const rect = lastTitleSectionRef.current.getBoundingClientRect();
      // const imageGridRect = imageGridSectionRef.current.getBoundingClientRect();
      setShouldStick(rect.top <= 0);
      // setImageGridTop(imageGridRect.top <= 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // KST(대한민국 표준시) 기준 다음 23시의 타임스탬프를 계산하는 함수
  const getNext23KstTimestamp = () => {
    const now = Date.now();
    const kstOffsetMs = 9 * 60 * 60 * 1000; // KST는 UTC+9

    // 현재 UTC 시간에 KST 오프셋을 더해 가상의 KST 기준 Date 객체 생성
    const kstDate = new Date(now + kstOffsetMs);

    // 현재 KST 시간 추출
    const currentKstHour = kstDate.getUTCHours();

    // 목표 시간을 KST 23:00:00.000으로 설정
    kstDate.setUTCHours(23, 0, 0, 0);

    // 만약 현재 시간이 KST 기준 23시를 넘었다면, 다음 날 23시로 설정
    if (currentKstHour >= 23) {
      kstDate.setUTCDate(kstDate.getUTCDate() + 1);
    }

    // 계산된 가상의 KST 밀리초에서 오프셋을 다시 빼서 실제(UTC) 타임스탬프로 반환
    return kstDate.getTime() - kstOffsetMs;
  };

  useEffect(() => {
    const imageUrl = popupImage?.image?.asset?.url;

    if (!imageUrl) {
      setIsPopupOpen(false);
      setHideForToday(false);
      return;
    }

    // 사진을 업데이트하고 새로 배포 : 이미지 URL을 키값에 포함
    // 이미지를 변경하여 새로 배포하면 URL이 달라지므로 새로운 키로 인식하여 팝업이 열립니다.
    const hideUntilKey = `oreathalf-hide-popup-until-${imageUrl}`;
    const storedUntil = Number(window.localStorage.getItem(hideUntilKey));
    const now = Date.now();

    if (storedUntil && storedUntil > now) {
      setHideForToday(true);
      setIsPopupOpen(false);
      return;
    }

    if (storedUntil && storedUntil <= now) {
      window.localStorage.removeItem(hideUntilKey);
    }

    setHideForToday(false);
    setIsPopupOpen(true);
  }, [popupImage]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleHideForToday = () => {
    const imageUrl = popupImage?.image?.asset?.url;
    if (!imageUrl) return;

    // 대한민국 시간으로 23시가 지났을 때 : KST 기준 다가오는 23시까지 숨김 처리
    const until = getNext23KstTimestamp();
    const hideUntilKey = `oreathalf-hide-popup-until-${imageUrl}`;

    window.localStorage.setItem(hideUntilKey, String(until));
    setHideForToday(true);
    setIsPopupOpen(false);
  };

  const popupImageUrl = getSanityImageSrc(popupImage?.image?.asset?.url, 1200);

  return (
    <main className="min-h-screen bg-background">
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
          <div className={shouldStick ? "invisible" : "visible"}>
            <InteractiveBigTitle
              englishText={"or.....EAT HALF!"}
              koreanText={"아니면.....절반만 먹기!"}
            />
          </div>
        </section>
      </section>

      {/* 여기를 손볼테야 */}
      <section ref={imageGridSectionRef} className="mx-auto">
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {hoverImageGroups.map((group) => (
            <IngredientImageHover key={group.ingredientNumber} group={group} />
          ))}
          {ingredientGroups.map((group) => (
            <IngredientImageCarousel key={group.ingredientId} group={group} />
          ))}
        </div>
      </section>

      {isPopupOpen && popupImage && popupImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <div className="relative w-[45vh] max-w-[90vw] overflow-hidden shadow-2xl">
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={popupImageUrl}
                alt={popupImage.image?.alt || popupImage.title || "팝업 이미지"}
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-4 sunflower-bold">
              <button
                type="button"
                onClick={handleHideForToday}
                className={`flex-1 border px-3 py-2 transition-colors ${
                  hideForToday
                    ? "border-white bg-white text-[#1e1d1d]"
                    : "border-white/30 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                하루동안숨기기
              </button>

              <button
                type="button"
                onClick={handleClosePopup}
                className="flex-1 bg-white px-3 py-2 text-[#1e1d1d] transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
