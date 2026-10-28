"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/assets/css/AboutExperience.module.css";
import AboutContent from "./AboutContent";
import AboutWhyDiet from "./AboutWhyDiet";
import AboutDevelopment from "./AboutDevelopment";

export default function AboutExperience() {
  const pageRef = useRef<HTMLElement>(null);
  const [isVerticalScrollUnlocked, setIsVerticalScrollUnlocked] =
    useState(false);

  useEffect(() => {
    if (!isVerticalScrollUnlocked) return;

    const page = pageRef.current;
    const development = document.getElementById("about-development");
    if (!page || !development) return;

    if (!("IntersectionObserver" in window)) {
      const unlockWhenVisible = () => {
        const pageBounds = page.getBoundingClientRect();
        const developmentBounds = development.getBoundingClientRect();
        if (
          developmentBounds.top >= pageBounds.top - 1 &&
          developmentBounds.bottom <= pageBounds.bottom + 1
        ) {
          setIsVerticalScrollUnlocked(false);
        }
      };

      page.addEventListener("scroll", unlockWhenVisible, { passive: true });
      unlockWhenVisible();
      return () => page.removeEventListener("scroll", unlockWhenVisible);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
          setIsVerticalScrollUnlocked(false);
        }
      },
      { root: page, threshold: 0.9 },
    );

    observer.observe(development);
    return () => observer.disconnect();
  }, [isVerticalScrollUnlocked]);

  function openDevelopment() {
    setIsVerticalScrollUnlocked(true);
    document.getElementById("about-development")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  return (
    <main
      ref={pageRef}
      className={`${styles.page} ${isVerticalScrollUnlocked ? styles.verticalScrollUnlocked : ""}`}
    >
      <AboutWhyDiet />
      <AboutContent
        isVerticalScrollUnlocked={isVerticalScrollUnlocked}
        onOpenDevelopment={openDevelopment}
      />
      <AboutDevelopment />
    </main>
  );
}
