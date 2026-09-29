import styles from "../../assets/css/AboutExperience.module.css";
import AboutContent from "./AboutContent";
import AboutWhyDiet from "./AboutWhyDiet";

export default function AboutExperience() {
  return (
    <main className={styles.page}>
      <AboutWhyDiet />
      <AboutContent />
    </main>
  );
}
