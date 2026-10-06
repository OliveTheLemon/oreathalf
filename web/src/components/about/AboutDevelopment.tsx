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
              <h2>하나의 웹 공간으로</h2>
              <p className={styles.caption}>Instagram에 기록하던 콘텐츠를</p>
              <p className={styles.caption}>
                하나의 웹 공간에서 탐색할 수 있도록 만들었습니다.
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
              <h2>기능</h2>
              <p className={styles.caption}>
                이미지 전환 - 재료별 콘텐츠 탐색 - 이미지 필터링 - 반응형
                인터페이스
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
              <h2>oreathalf.com</h2>
              <p className={styles.caption}>기술 스택 목록</p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div className={styles.developmentContent}>
            <div className={styles.developmentCopy}>
              <p className={styles.index}>03 — DEVELOPMENT</p>
              <h2>계획부터 개발까지</h2>
              <p className={styles.caption}>
                각 과정에서 직접 고민하고 만들었습니다.
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel} ${styles.developmentLastPanel}`}
        >
          <div className={styles.developmentContent}>
            <div className={styles.developmentCopy}>
              <p className={styles.index}>03 — DEVELOPMENT</p>
              <h2>계획부터 개발까지</h2>
              <p className={styles.caption}>
                각 과정에서 직접 고민하고 만들었습니다.
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
