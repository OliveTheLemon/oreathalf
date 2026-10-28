"use client";

import styles from "@/assets/css/AboutExperience.module.css";
import AboutContent from "./AboutContent";
import AboutWhyDiet from "./AboutWhyDiet";
import AboutDevelopment from "./AboutDevelopment";

export default function AboutExperience() {
  return (
    <main className={styles.page}>
      <AboutWhyDiet />
      <AboutContent />
      <AboutDevelopment />
    </main>
  );
}
