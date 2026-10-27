"use client";

import { useEffect } from "react";

const SCROLL_DURATION_MS = 680;
const WHEEL_THRESHOLD = 18;
const WHEEL_RESET_MS = 140;
const TOUCH_THRESHOLD = 48;

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

function getPageSections() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("main.page-snap > section"),
  );
}

function getSectionTop(section: HTMLElement) {
  return window.scrollY + section.getBoundingClientRect().top;
}

function getNearestSectionIndex(sections: HTMLElement[]) {
  const currentY = window.scrollY;

  return sections.reduce((nearestIndex, section, index) => {
    const nearestDistance = Math.abs(getSectionTop(sections[nearestIndex]) - currentY);
    const distance = Math.abs(getSectionTop(section) - currentY);

    return distance < nearestDistance ? index : nearestIndex;
  }, 0);
}

export default function SmoothSectionScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");

    if (reduceMotion.matches) {
      return;
    }

    let animationFrame = 0;
    let isAnimating = false;
    let isReadingAbout = false;
    let wheelDelta = 0;
    let wheelResetTimer = 0;
    let touchStartY: number | null = null;

    const setAnimating = (value: boolean) => {
      isAnimating = value;
      document.documentElement.classList.toggle("section-scroll-animating", value);
      document.body.classList.toggle("section-scroll-animating", value);
    };

    const setReadingAbout = (value: boolean) => {
      isReadingAbout = value;
      document.documentElement.classList.toggle("section-scroll-reading", value);
      document.body.classList.toggle("section-scroll-reading", value);
    };

    const getAboutScrollRange = () => {
      const about = document.getElementById("about");
      if (!about) return null;

      const start = getSectionTop(about);
      const end = start + about.getBoundingClientRect().height - window.innerHeight;
      return end > start + 2 ? { start, end } : null;
    };

    const readAbout = (deltaY: number) => {
      const range = getAboutScrollRange();
      const currentY = window.scrollY;
      if (!range || currentY < range.start - 2 || currentY > range.end + 2) {
        return false;
      }

      const targetY = Math.max(range.start, Math.min(range.end, currentY + deltaY));
      if (Math.abs(targetY - currentY) < 1) return false;

      setReadingAbout(true);
      window.scrollTo({ top: targetY, behavior: "instant" });
      return true;
    };

    const scrollToSection = (target: HTMLElement) => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(wheelResetTimer);
      wheelDelta = 0;

      const startY = window.scrollY;
      const targetY = getSectionTop(target);
      const distance = targetY - startY;
      const startedAt = performance.now();

      if (Math.abs(distance) < 2) {
        return;
      }

      setAnimating(true);
      setReadingAbout(false);

      const tick = (now: number) => {
        if (mobileViewport.matches) {
          setAnimating(false);
          return;
        }
        if (document.querySelector(".work-board-viewport.has-selection")) {
          setAnimating(false);
          return;
        }
        const elapsed = now - startedAt;
        const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
        const easedProgress = easeOutQuart(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
          return;
        }

        window.scrollTo(0, targetY);
        setAnimating(false);
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const moveToAdjacentSection = (direction: 1 | -1) => {
      const sections = getPageSections();

      if (sections.length < 2) {
        return;
      }

      const currentIndex = getNearestSectionIndex(sections);
      const targetIndex = Math.max(
        0,
        Math.min(sections.length - 1, currentIndex + direction),
      );

      if (targetIndex === currentIndex) {
        return;
      }

      scrollToSection(sections[targetIndex]);
    };

    const handleWheel = (event: WheelEvent) => {
      if (mobileViewport.matches || event.ctrlKey || document.querySelector(".work-board-viewport.has-selection")) {
        return;
      }

      const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const deltaY = event.deltaY * deltaMultiplier;

      event.preventDefault();

      if (isAnimating) {
        return;
      }

      if (readAbout(deltaY)) {
        wheelDelta = 0;
        return;
      }

      if (wheelDelta !== 0 && Math.sign(wheelDelta) !== Math.sign(deltaY)) {
        wheelDelta = 0;
      }

      wheelDelta += deltaY;
      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelDelta = 0;
      }, WHEEL_RESET_MS);

      if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) {
        return;
      }

      moveToAdjacentSection(wheelDelta > 0 ? 1 : -1);
      wheelDelta = 0;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (mobileViewport.matches) {
        touchStartY = null;
        return;
      }
      if ((event.target as Element).closest(".work-board-viewport, [role='dialog']")) {
        touchStartY = null;
        return;
      }
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (mobileViewport.matches || touchStartY === null) {
        return;
      }

      const currentY = event.touches[0]?.clientY;

      if (currentY === undefined) {
        return;
      }

      const deltaY = touchStartY - currentY;

      if (!isAnimating && readAbout(deltaY)) {
        event.preventDefault();
        touchStartY = currentY;
        return;
      }

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) {
        return;
      }

      event.preventDefault();

      if (!isAnimating) {
        moveToAdjacentSection(deltaY > 0 ? 1 : -1);
      }

      touchStartY = null;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (mobileViewport.matches) return;
      if (document.querySelector(".work-board-viewport.has-selection") ||
          (event.target as Element).closest("button, a, input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      const nextKeys = new Set(["ArrowDown", "PageDown", " "]);
      const previousKeys = new Set(["ArrowUp", "PageUp"]);

      if (!nextKeys.has(event.key) && !previousKeys.has(event.key)) {
        return;
      }

      event.preventDefault();

      if (isAnimating) {
        return;
      }

      const direction = nextKeys.has(event.key) ? 1 : -1;
      const step = event.key.startsWith("Arrow") ? window.innerHeight / 8 : window.innerHeight * 0.8;
      if (readAbout(direction * step)) return;

      moveToAdjacentSection(direction);
    };

    const handleScroll = () => {
      if (isAnimating || mobileViewport.matches) return;
      const range = getAboutScrollRange();
      const withinAbout = Boolean(range && window.scrollY > range.start + 2 && window.scrollY <= range.end + 2);
      if (withinAbout !== isReadingAbout) setReadingAbout(withinAbout);
    };

    const handleViewportChange = () => {
      if (!mobileViewport.matches) return;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(wheelResetTimer);
      wheelDelta = 0;
      touchStartY = null;
      setAnimating(false);
      setReadingAbout(false);
    };

    mobileViewport.addEventListener("change", handleViewportChange);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(wheelResetTimer);
      setAnimating(false);
      setReadingAbout(false);
      mobileViewport.removeEventListener("change", handleViewportChange);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return null;
}
