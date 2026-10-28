import { useEffect, type RefObject } from "react";

export function useHorizontalWheelScroll(
  trackRef: RefObject<HTMLDivElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !enabled) return;

    let wheelEndTimer: number | undefined;
    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        Math.abs(event.deltaY) < Math.abs(event.deltaX)
      ) {
        return;
      }

      if (wheelEndTimer !== undefined) {
        event.preventDefault();
        window.clearTimeout(wheelEndTimer);
        wheelEndTimer = window.setTimeout(() => {
          wheelEndTimer = undefined;
        }, 450);
        return;
      }

      const atStart = track.scrollLeft <= 1;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

      event.preventDefault();
      wheelEndTimer = window.setTimeout(() => {
        wheelEndTimer = undefined;
      }, 450);

      const behavior = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth";
      track.scrollBy({
        left: Math.sign(event.deltaY) * track.clientWidth,
        behavior,
      });
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      track.removeEventListener("wheel", onWheel);
      if (wheelEndTimer !== undefined) window.clearTimeout(wheelEndTimer);
    };
  }, [enabled, trackRef]);
}
