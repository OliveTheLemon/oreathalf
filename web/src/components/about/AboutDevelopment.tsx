import { useRef } from "react";
import Image from "next/image";
import styles from "../../assets/css/AboutExperience.module.css";
import { useHorizontalWheelScroll } from "./scrollHelpers";

export default function AboutDevelopment() {
  const trackRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);

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
