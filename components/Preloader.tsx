"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TARGET_TEXT = "DIZFANIT DESIGN";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const INITIAL_TEXT = TARGET_TEXT.replace(/\S/g, "0");
const HERO_VIDEO_SRC = "/videos/hero-background.mp4";
const FRAME_INTERVAL_MS = 45;
const SCRAMBLE_DURATION_MS = 1850;
const EXIT_START_MS = 2050;
const VIDEO_PRELOAD_TIMEOUT_MS = 3500;
const EXIT_FAILSAFE_MS = EXIT_START_MS + 1000;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getRandomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? "0";
}

function buildScrambleFrame(progress: number) {
  const targetLetterCount = TARGET_TEXT.replace(/\s/g, "").length;
  const lockedLetterCount = Math.floor(progress * targetLetterCount);
  let currentLetter = 0;

  return TARGET_TEXT.split("")
    .map((char) => {
      if (char === " ") {
        return " ";
      }

      currentLetter += 1;
      return currentLetter <= lockedLetterCount ? char : getRandomChar();
    })
    .join("");
}

function preloadHeroVideo() {
  return new Promise<void>((resolve) => {
    const video = document.createElement("video");
    let isResolved = false;
    let timeoutId: number | undefined;

    const finish = () => {
      if (isResolved) {
        return;
      }

      isResolved = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      video.removeEventListener("canplay", finish);
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("error", finish);
      resolve();
    };

    timeoutId = window.setTimeout(finish, VIDEO_PRELOAD_TIMEOUT_MS);

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("canplay", finish);
    video.addEventListener("loadeddata", finish);
    video.addEventListener("error", finish);

    try {
      video.src = HERO_VIDEO_SRC;
      video.load();
    } catch {
      finish();
    }
  });
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [displayText, setDisplayText] = useState(INITIAL_TEXT);
  const [loadingPercent, setLoadingPercent] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let hasFinished = false;
    let failsafeId: number | undefined;

    const startedAt = performance.now();
    const frameId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1);
      const percentProgress = Math.min(elapsed / EXIT_START_MS, 1);

      setDisplayText(buildScrambleFrame(progress));
      setLoadingPercent(Math.min(Math.round(percentProgress * 100), 99));
    }, FRAME_INTERVAL_MS);

    const finishPreloader = () => {
      if (!isMounted || hasFinished) {
        return;
      }

      hasFinished = true;
      window.clearInterval(frameId);
      if (failsafeId !== undefined) {
        window.clearTimeout(failsafeId);
      }
      setDisplayText(TARGET_TEXT);
      setLoadingPercent(100);
      setIsVisible(false);
    };

    failsafeId = window.setTimeout(finishPreloader, EXIT_FAILSAFE_MS);
    void preloadHeroVideo().catch(() => undefined);
    void wait(EXIT_START_MS).then(finishPreloader, finishPreloader);

    return () => {
      isMounted = false;
      window.clearInterval(frameId);
      if (failsafeId !== undefined) {
        window.clearTimeout(failsafeId);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          aria-label="Loading DIZFANIT DESIGN"
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-black text-text-primary"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.9)_0_1px,transparent_1px_5px)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,10,10,0.18),transparent_34%)]"
            aria-hidden="true"
          />

          <div className="absolute left-1/2 top-1/2 z-10 w-max max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2">
            <motion.p
              aria-label={TARGET_TEXT}
              className="whitespace-nowrap text-center font-heading text-[20px] font-bold uppercase leading-none tracking-[0.1em] text-text-primary drop-shadow-[0_0_18px_rgba(230,226,218,0.38)] min-[420px]:text-[28px] sm:text-[38px] sm:tracking-[0.12em]"
              initial={{ filter: "blur(5px)", opacity: 0.82 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {displayText}
            </motion.p>

            <motion.p
              className="absolute left-1/2 top-full min-w-[5ch] -translate-x-1/2 text-center font-mono text-[13px] font-semibold leading-none tracking-[0.28em] text-accent-red-bright tabular-nums drop-shadow-[0_0_16px_rgba(209,10,10,0.82)] sm:text-[15px]"
              aria-live="polite"
              style={{ marginTop: "clamp(32px, 4vh, 48px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {loadingPercent.toString().padStart(3, "0")}%
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
