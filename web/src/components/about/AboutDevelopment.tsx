import styles from "../../assets/css/AboutExperience.module.css";

export default function AboutDevelopment() {
  return (
    <section className={`${styles.horizontalPanel} ${styles.storyPanel}`}>
      <div className={styles.panelHeading}>
        <p className={styles.index}>03 — DEVELOPMENT</p>
        <h2>기록에서 경험으로</h2>
      </div>
      <p className={styles.caption}>
        먹는 순간을 더 다정하게 연결하는 방법을 만들어갑니다.
      </p>
    </section>
  );
}
