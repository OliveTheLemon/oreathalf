"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { IngredientImageGroup, SanityImageItem } from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";
import { InteractiveBigTitle } from "@/components/InteractiveBigTitle";
import { InteractiveTitle } from "@/components/InteractiveTitle";

type HomePageContentProps = {
  ingredientGroups: IngredientImageGroup[];
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
  popupImage,
}: HomePageContentProps) {
  const [shouldStick, setShouldStick] = useState(false);
  const lastTitleSectionRef = useRef<HTMLElement | null>(null);
  const [imageGridTop, setImageGridTop] = useState(false);
  const imageGridSectionRef = useRef<HTMLElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!lastTitleSectionRef.current) {
        return;
      }
      if (!imageGridSectionRef.current) {
        return;
      }

      const rect = lastTitleSectionRef.current.getBoundingClientRect();
      const imageGridRect = imageGridSectionRef.current.getBoundingClientRect();
      setShouldStick(rect.top <= 0);
      setImageGridTop(imageGridRect.top <= 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!popupImage?.image?.asset?.url) {
      setIsPopupOpen(false);
      return;
    }

    const storedPreference = window.localStorage.getItem(
      "oreathalf-hide-popup",
    );
    const shouldHide = storedPreference === "true";

    setDontShowAgain(shouldHide);
    setIsPopupOpen(!shouldHide);
  }, [popupImage]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDontShowAgain = () => {
    const nextValue = !dontShowAgain;
    setDontShowAgain(nextValue);
    window.localStorage.setItem("oreathalf-hide-popup", String(nextValue));

    if (nextValue) {
      setIsPopupOpen(false);
    }
  };

  const popupImageUrl = getSanityImageSrc(popupImage?.image?.asset?.url, 1200);

  return (
    <main className="min-h-screen bg-background">
      <div
        className={`fixed top-0 left-0 w-full z-20 bg-background/90 py-2 transition-opacity duration-200 ${
          shouldStick ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <InteractiveBigTitle
          englishText={"or.....EAT HALF!"}
          koreanText={"아니면.....절반만 먹기!"}
          isPinned={imageGridTop}
        />
      </div>

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

      <section ref={imageGridSectionRef} className="mx-auto px-2 pb-12">
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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

            <div className="flex items-center justify-between gap-3 p-4 text-sm text-white font-designhouse">
              <button
                type="button"
                onClick={handleDontShowAgain}
                className={`flex-1 border px-3 py-2 font-medium transition-colors ${
                  dontShowAgain
                    ? "border-white bg-white text-[#1e1d1d]"
                    : "border-white/30 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                다시보지않기
              </button>

              <button
                type="button"
                onClick={handleClosePopup}
                className="flex-1 bg-white px-3 py-2 font-medium text-[#1e1d1d] transition-colors hover:bg-gray-200"
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
