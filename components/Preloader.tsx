"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TARGET_TEXT = "DIZFANIT DESIGN";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SESSION_KEY = "dizfanit-design-preloader-seen";
const FRAME_INTERVAL_MS = 45;
const SCRAMBLE_DURATION_MS = 1850;
const EXIT_START_MS = 2050;

function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
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

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState(() => buildScrambleFrame(0));
  const displayChars = displayText.split("");

  useEffect(() => {
    if (hasSeenPreloader()) {
      return;
    }

    setIsVisible(true);

    const startedAt = performance.now();
    const frameId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1);
      setDisplayText(buildScrambleFrame(progress));
    }, FRAME_INTERVAL_MS);

    const finishId = window.setTimeout(() => {
      window.clearInterval(frameId);
      setDisplayText(TARGET_TEXT);
      markPreloaderSeen();
      setIsVisible(false);
    }, EXIT_START_MS);

    return () => {
      window.clearInterval(frameId);
      window.clearTimeout(finishId);
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
              className="flex items-center justify-center whitespace-nowrap font-heading text-[22px] font-bold uppercase leading-none tracking-normal text-text-primary drop-shadow-[0_0_18px_rgba(230,226,218,0.38)] min-[420px]:text-[30px] sm:text-[40px]"
              initial={{ filter: "blur(5px)", opacity: 0.82 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {displayChars.map((char, index) => (
                <span
                  aria-hidden="true"
                  className={
                    char === " "
                      ? "inline-block w-[0.58em]"
                      : "inline-flex w-[0.86em] justify-center"
                  }
                  key={`${index}-${char}`}
                >
                  {char === " " ? "\u00a0" : char}
                </span>
              ))}
            </motion.p>

            <div
              className="mx-auto mt-4 h-px w-[min(100%,340px)] overflow-hidden bg-text-primary/18"
              aria-hidden="true"
            >
              <motion.div
                className="h-full origin-left bg-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.9)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: SCRAMBLE_DURATION_MS / 1000,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
