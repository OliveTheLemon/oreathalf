import { useRef } from "react";
import Image from "next/image";
import styles from "../../assets/css/AboutExperience.module.css";
import TechnologyLabel from "./TechnologyLabel";
import { useHorizontalWheelScroll } from "./scrollHelpers";

interface AboutDevelopmentProps {
  onBackToTop: () => void;
}

export default function AboutDevelopment({
  onBackToTop,
}: AboutDevelopmentProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);

  function returnToTop() {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    trackRef.current?.scrollTo({ left: 0, behavior });
    onBackToTop();
  }

  return (
    <section
      id="about-development"
      className={`${styles.horizontalDeck} ${styles.developmentDeck}`}
      aria-label="oreathalf 개발 이야기"
    >
      <div className={styles.horizontalTrack} ref={trackRef}>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <span className={styles.scrollMark}>SCROLL RIGHT TO EXPLORE →</span>
          <div className={styles.developmentContent}>
            <Image
              className={styles.LogoImage}
              src="https://cdn.sanity.io/images/ph340op5/production/259eced2db356d777172a2c06be4d3bc53127d2a-1351x1191.png"
              alt="oreathalf 로고 이미지"
              width={1351}
              height={1191}
            />
            <div className={styles.developmentCopy}>
              <h2>하나의 웹 공간으로</h2>
              <p className={styles.caption}>Instagram 속 콘텐츠를</p>
              <p className={styles.caption}>웹 그리고 모바일로</p>
            </div>
          </div>
        </section>
        {/* <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div className={styles.developmentContent}>
            <div className={styles.developmentCopy}>
              <h2>기능</h2>
              <p className={styles.caption}>
                이미지 전환 - 재료별 콘텐츠 탐색 - 이미지 필터링 - 반응형
                인터페이스
              </p>
            </div>
          </div>
        </section> */}
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div
            className={styles.technologyLabels}
            role="group"
            aria-label="사용한 기술"
          >
            <TechnologyLabel
              text="TypeScript"
              className={styles.technologyTypeScript}
            />
            <TechnologyLabel
              text="반응형 웹"
              className={styles.technologyResponsive}
            />
            <TechnologyLabel text="Next.js" className={styles.technologyNext} />
            <TechnologyLabel
              text="Vercel"
              className={styles.technologyVercel}
            />
            <TechnologyLabel
              text="sanity"
              className={styles.technologySanity}
            />
          </div>
          <div className={styles.developmentContent}>
            <Image
              className={styles.LogoImage}
              src="https://cdn.sanity.io/images/ph340op5/production/259eced2db356d777172a2c06be4d3bc53127d2a-1351x1191.png"
              alt="oreathalf 로고 이미지"
              width={1351}
              height={1191}
            />
            <div
              className={`${styles.developmentCopy} ${styles.developmentDragPosition}`}
            >
              <h2>oreathalf.com</h2>
              <div className={styles.developmentDrag}></div>
              <div className={styles.developmentDragLeftLine}></div>
              <div className={styles.developmentDragRightLine}></div>
              <div className={styles.developmentDragLeftCircle}></div>
              <div className={styles.developmentDragRightCircle}></div>
              <p className={styles.caption}>
                <br />
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel}`}
        >
          <div
            className={styles.technologyLabels}
            role="group"
            aria-label="사용한 기술"
          >
            <TechnologyLabel
              text="Content"
              className={styles.technologyTypeScript}
            />
            <TechnologyLabel
              text="Marketing"
              className={styles.technologyResponsive}
            />
            <TechnologyLabel
              text="Planning"
              className={styles.technologyNext}
            />
            <TechnologyLabel
              text="Design"
              className={styles.technologyVercel}
            />
            <TechnologyLabel
              text="Development"
              className={styles.technologySanity}
            />
          </div>
          <div className={styles.developmentContent}>
            <Image
              className={styles.LogoImage}
              src="https://cdn.sanity.io/images/ph340op5/production/259eced2db356d777172a2c06be4d3bc53127d2a-1351x1191.png"
              alt="oreathalf 로고 이미지"
              width={1351}
              height={1191}
            />
            <div className={styles.developmentCopy}>
              <h2>기획부터 개발까지</h2>
              <p className={styles.caption}>직접 고민했습니다.</p>
            </div>
          </div>
        </section>
        <section
          className={`${styles.horizontalPanel} ${styles.developmentPanel} ${styles.developmentLastPanel}`}
        >
          <div className={styles.developmentContent}>
            <Image
              className={styles.LogoImage}
              src="https://cdn.sanity.io/images/ph340op5/production/33aae154eeb419b6e3ad7d2d7440229fd78ab8ac-1351x1191.png"
              alt="oreathalf 로고 이미지"
              width={1351}
              height={1191}
            />
            <div
              className={`${styles.developmentCopy} ${styles.developmentCopyLast}`}
            >
              <h2>is still in progress.....</h2>
              <p className={styles.caption}>
                <br />
              </p>
              <button
                type="button"
                className={styles.backToTopButton}
                onClick={returnToTop}
              >
                ↑ 맨 위로
              </button>
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
