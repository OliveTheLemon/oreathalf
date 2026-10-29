import { useEffect, type RefObject } from "react";

export function useHorizontalWheelScroll(
  trackRef: RefObject<HTMLDivElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !enabled) return;

    let wheelEndTimer: number | undefined;
    let edgeScrollForwarded = false;
    const restartWheelEndTimer = () => {
      if (wheelEndTimer !== undefined) window.clearTimeout(wheelEndTimer);
      wheelEndTimer = window.setTimeout(() => {
        wheelEndTimer = undefined;
        edgeScrollForwarded = false;
      }, 450);
    };

    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        Math.abs(event.deltaY) < Math.abs(event.deltaX)
      ) {
        return;
      }

      const atStart = track.scrollLeft <= 1;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      const atEdge =
        (event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd);

      if (atEdge && !edgeScrollForwarded) {
        edgeScrollForwarded = true;
        restartWheelEndTimer();
        event.stopPropagation();
        return;
      }

      if (wheelEndTimer !== undefined) {
        event.preventDefault();
        event.stopPropagation();
        restartWheelEndTimer();
        return;
      }

      event.preventDefault();
      edgeScrollForwarded = false;
      restartWheelEndTimer();

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
