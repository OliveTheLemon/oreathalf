import Image from "next/image";
import styles from "../../assets/css/AboutExperience.module.css";

export default function AboutDevelopment() {
  function moveDeck(event: React.WheelEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    if (
      event.defaultPrevented ||
      Math.abs(event.deltaY) < Math.abs(event.deltaX)
    )
      return;

    const atStart = track.scrollLeft <= 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

    track.scrollBy({ left: event.deltaY, behavior: "smooth" });
  }

  return (
    <section
      id="about-development"
      className={`${styles.horizontalDeck} ${styles.developmentDeck}`}
      aria-label="oreathalf 개발 이야기"
    >
      <div className={styles.horizontalTrack} onWheel={moveDeck}>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div className={styles.developmentContent}>
            <Image
              className={styles.LogoImage}
              src="https://cdn.sanity.io/images/ph340op5/production/6345d9e2ebef8185ec88406bf319596e8335a991-2038x780.png"
              alt="oreathalf 로고 이미지"
              width={2038}
              height={780}
            />
            <div className={styles.developmentCopy}>
              <p className={styles.index}>03 — DEVELOPMENT</p>
              <h2>텍스트</h2>
              <p className={styles.caption}>
                먹는 순간을 더 다정하게 연결하는 방법을 만들어갑니다.
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div className={styles.developmentContent}>
            <div className={styles.developmentCopy}>
              <p className={styles.index}>03 — DEVELOPMENT</p>
              <h2>텍스트</h2>
              <p className={styles.caption}>
                먹는 순간을 더 다정하게 연결하는 방법을 만들어갑니다.
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div className={styles.developmentContent}>
            <div className={styles.developmentCopy}>
              <p className={styles.index}>03 — DEVELOPMENT</p>
              <h2>텍스트</h2>
              <p className={styles.caption}>
                먹는 순간을 더 다정하게 연결하는 방법을 만들어갑니다.
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div className={styles.developmentContent}>
            <div className={styles.developmentCopy}>
              <p className={styles.index}>03 — DEVELOPMENT</p>
              <h2>텍스트</h2>
              <p className={styles.caption}>
                먹는 순간을 더 다정하게 연결하는 방법을 만들어갑니다.
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className={styles.developmentImagePin}>
        <Image
          className={styles.developmentImage}
          src="https://cdn.sanity.io/images/ph340op5/production/3d39759ceda3ed9b3e1460ed15c3e9bbac9e9273-1351x1191.png"
          alt="모니터 이미지"
          width={1351}
          height={1191}
        />
      </div>
    </section>
  );
}
