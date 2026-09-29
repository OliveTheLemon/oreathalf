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
    <>
      <section
        id="about-development"
        className={styles.horizontalDeck}
        aria-label="oreathalf 이야기"
      >
        <div className={styles.horizontalTrack} onWheel={moveDeck}>
          <section
            className={`${styles.horizontalPanel} ${styles.storyPanel} ${styles.developmentPanel}`}
          >
            <div className={styles.developmentContent}>
              <Image
                className={styles.developmentImage}
                src="https://cdn.sanity.io/images/ph340op5/production/3d39759ceda3ed9b3e1460ed15c3e9bbac9e9273-1351x1191.png"
                alt="oreathalf 프로젝트 이미지"
                width={1351}
                height={1191}
              />
              <div className={styles.developmentCopy}>
                <p className={styles.index}>03 — DEVELOPMENT</p>
                <h2>기록에서 경험으로</h2>
                <p className={styles.caption}>
                  먹는 순간을 더 다정하게 연결하는 방법을 만들어갑니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
