"use client";

import { useState } from "react";
import styles from "@/assets/css/AboutExperience.module.css";
import AboutContent from "./AboutContent";
import AboutWhyDiet from "./AboutWhyDiet";
import AboutDevelopment from "./AboutDevelopment";

export default function AboutExperience() {
  const [isVerticalScrollUnlocked, setIsVerticalScrollUnlocked] =
    useState(false);

  function openDevelopment() {
    setIsVerticalScrollUnlocked(true);
    document.getElementById("about-development")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main
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
