import styles from "../../assets/css/AboutExperience.module.css";

export default function AboutWhyDiet() {
  return (
    <div className={styles.verticalTrack}>
      <section className={`${styles.verticalPanel} ${styles.intro}`}>
        <p className={styles.eyebrow}>OREATHALF / ABOUT</p>
        <h1>
          한 끼의 기록,
          <br />
          우리의 이야기.
        </h1>
        <p className={styles.caption}>아주 평범한 식탁에서 시작합니다.</p>
        <span className={styles.scrollMark}>SCROLL TO MEET US ↓</span>
      </section>
      <section className={`${styles.verticalPanel} ${styles.yellow}`}>
        <p className={styles.index}>01 — COLLECT</p>
        <h2>
          무엇을 먹었는지
          <br />
          찬찬히 들여다봅니다.
        </h2>
        <p className={styles.caption}>재료와 계절, 그날의 기분까지.</p>
      </section>
      <section className={`${styles.verticalPanel} ${styles.coral}`}>
        <p className={styles.index}>02 — CONNECT</p>
        <h2>
          음식으로 이어지는
          <br />
          사람과 사람.
        </h2>
        <p className={styles.caption}>각자의 식탁이 서로의 이야기가 되도록.</p>
      </section>
      <section className={`${styles.verticalPanel} ${styles.green}`}>
        <p className={styles.index}>03 — REMEMBER</p>
        <h2>
          잘 먹은 하루를
          <br />
          오래 기억하는 방법.
        </h2>
        <p className={styles.caption}>OREATHALF, 먹는 마음을 기록합니다.</p>
      </section>
    </div>
  );
}
