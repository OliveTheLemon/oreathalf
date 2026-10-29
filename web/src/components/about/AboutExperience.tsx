"use client";

import { useRef } from "react";
import styles from "@/assets/css/AboutExperience.module.css";
import AboutContent from "./AboutContent";
import AboutWhyDiet from "./AboutWhyDiet";
import AboutDevelopment from "./AboutDevelopment";

export default function AboutExperience() {
  const pageRef = useRef<HTMLElement>(null);

  function backToTop() {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    pageRef.current?.scrollTo({ top: 0, behavior });
  }

  return (
    <main ref={pageRef} className={styles.page}>
      <AboutWhyDiet />
      <AboutContent />
      <AboutDevelopment onBackToTop={backToTop} />
    </main>
  );
}
