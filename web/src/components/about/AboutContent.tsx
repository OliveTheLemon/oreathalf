"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../../assets/css/AboutExperience.module.css";

const photographs = [
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
];

const storyImages = [
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85",
];

const stories = [
  "오늘의 재료",
  "천천히 차린 식탁",
  "같이 먹는 마음",
  "다음 한 끼",
];

interface AboutContentProps {
  isVerticalScrollUnlocked: boolean;
  onOpenDevelopment: () => void;
}

export default function AboutContent({
  isVerticalScrollUnlocked,
  onOpenDevelopment,
}: AboutContentProps) {
  const storyTrack = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % storyImages.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  function moveStoryTrack(event: React.WheelEvent<HTMLDivElement>) {
    const track = storyTrack.current;
    if (!track || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const atStart = track.scrollLeft <= 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

    track.scrollBy({ left: event.deltaY, behavior: "smooth" });
  }

  function moveDeck(event: React.WheelEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    if (
      isVerticalScrollUnlocked ||
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
    <section className={styles.horizontalDeck} aria-label="oreathalf 이야기">
      <div className={styles.horizontalTrack} onWheel={moveDeck}>
        <section className={`${styles.horizontalPanel} ${styles.deckIntro}`}>
          <p className={styles.eyebrow}>'나도 다이어트 하고싶어'</p>
          <h2>
            누군가에게 <br />
            계기가 될 수 있도록
          </h2>
          <span className={styles.scrollMark}>SWIPE TO EXPLORE →</span>
        </section>

        <section className={`${styles.horizontalPanel} ${styles.cardPanel}`}>
          <div className={styles.panelHeading}>
            <p className={styles.index}>01 — TABLE NOTES</p>
            <h2>레시피 정보를 나누고</h2>
          </div>
          <div
            className={styles.cardViewport}
            ref={storyTrack}
            onWheel={moveStoryTrack}
          >
            {photographs.map((image, index) => (
              <article className={styles.noteCard} key={image}>
                <div
                  className={styles.noteImage}
                  style={{ backgroundImage: `url("${image}")` }}
                  role="img"
                  aria-label={`오늘의 식탁 사진 ${index + 1}`}
                />
                <div className={styles.noteCopy}>
                  <span>TABLE NOTE / {String(index + 1).padStart(2, "0")}</span>
                  <h3>
                    {
                      [
                        "초록을 담은 점심",
                        "천천히 익어가는 맛",
                        "오늘의 작은 수확",
                        "다정한 한 그릇",
                      ][index]
                    }
                  </h3>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.hint}>마우스 휠을 움직여 다음 장을 만나보세요</p>
        </section>

        <section className={`${styles.horizontalPanel} ${styles.storyPanel}`}>
          <div className={styles.panelHeading}>
            <p className={styles.index}>02 — IN THE MOMENT</p>
            <h2>식단을 기록했습니다.</h2>
          </div>
          <div className={styles.storyFrame}>
            <div className={styles.storyProgress}>
              {storyImages.map((image, index) => (
                <span
                  className={index === activeStory ? styles.progressActive : ""}
                  key={image}
                />
              ))}
            </div>
            <div
              className={styles.storyImage}
              style={{
                backgroundImage: `url("${storyImages[activeStory]}")`,
              }}
              role="img"
              aria-label={stories[activeStory]}
            />
            <div className={styles.storyLabel}>
              <span>OREATHALF STORY</span>
              <h3>{stories[activeStory]}</h3>
            </div>
          </div>
          <button
            className={styles.developmentButton}
            type="button"
            aria-label="AboutDevelopment 영역으로 이동"
            onClick={onOpenDevelopment}
          >
            <span aria-hidden="true">↓</span>
          </button>
        </section>
      </div>
    </section>
  );
}
