"use client";

import { useEffect, type RefObject } from "react";

// Wheel inertia belongs only to the modal; touch and keyboard remain native.
export function usePreviewScroll(ref: RefObject<HTMLDivElement | null>, enabled: boolean, reducedMotion: boolean) {
  useEffect(() => {
    const scroller = ref.current;
    if (!enabled || reducedMotion || !scroller) return;
    let frame = 0;
    let target = scroller.scrollTop;
    let position = target;
    let previousTime = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target = scroller.scrollTop;
      position = target;
    };
    const tick = (time: number) => {
      const elapsed = Math.min(64, time - previousTime);
      previousTime = time;
      target = Math.max(0, Math.min(scroller.scrollHeight - scroller.clientHeight, target));
      // Keep the fractional position: DOM scrollTop rounding can otherwise
      // stall small increments before reaching the target (including zero).
      const remaining = target - position;
      if (Math.abs(remaining) < 0.5) {
        position = target;
        scroller.scrollTop = target;
        frame = 0;
        return;
      }
      position += remaining * (1 - Math.exp(-elapsed / 85));
      scroller.scrollTop = position;
      frame = requestAnimationFrame(tick);
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (!frame) {
        target = scroller.scrollTop;
        position = target;
      }
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1;
      target = Math.max(0, Math.min(scroller.scrollHeight - scroller.clientHeight, target + event.deltaY * unit));
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("pointerdown", stop, { passive: true });
    scroller.addEventListener("keydown", stop);
    return () => {
      stop();
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("pointerdown", stop);
      scroller.removeEventListener("keydown", stop);
    };
  }, [ref, enabled, reducedMotion]);
}
