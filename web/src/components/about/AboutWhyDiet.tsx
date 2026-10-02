import styles from "../../assets/css/AboutExperience.module.css";

export default function AboutWhyDiet() {
  return (
    <div className={styles.verticalTrack}>
      <section className={`${styles.verticalPanel} ${styles.intro}`}>
        <p className={styles.eyebrow}>OREATHALF / ABOUT</p>
        <h1>
          From diet
          <br />
          To content
        </h1>
        {/* <p className={styles.caption}>아주 평범한 식탁에서 시작합니다.</p> */}
        <span className={styles.scrollMark}>SCROLL TO MEET US ↓</span>
      </section>
      <section className={`${styles.verticalPanel} ${styles.yellow}`}>
        <p className={styles.eyebrow}>OREATHALF / ABOUT</p>
        <p className={styles.caption}>단순한 기록을 넘어</p>
        {/* <p className={styles.caption}>콘텐츠를 만들어가는 소재로써의</p> */}
        <h2>
          콘텐츠의 소재로써의 <br />
          &apos;다이어트&apos;
        </h2>
      </section>
      <section className={`${styles.verticalPanel} ${styles.coral}`}>
        <p className={styles.eyebrow}>OREATHALF / ABOUT</p>
        <h2>왜 하필 다이어트였을까?</h2>
        {/* <p className={styles.caption}>각자의 식탁이 서로의 이야기가 되도록.</p> */}
      </section>
      <section className={`${styles.verticalPanel} ${styles.green}`}>
        <p className={styles.eyebrow}>OREATHALF / ABOUT</p>
        <h2>모두의 관심사</h2>
        <p className={styles.caption}>
          많은 사람, 나 역시도 직접 경험하고 있으니까
        </p>
      </section>
    </div>
  );
}
