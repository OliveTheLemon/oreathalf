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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.95) {
          setIsVerticalScrollUnlocked(false);
        }
      },
      { root: page, threshold: 0.95 },
    );

    observer.observe(development);
    return () => observer.disconnect();
  }, [isVerticalScrollUnlocked]);

  function openDevelopment() {
    setIsVerticalScrollUnlocked(true);
    document.getElementById("about-development")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
