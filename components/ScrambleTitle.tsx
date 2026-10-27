"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrambleTitle.module.css";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLE_MS = 900;
const FRAME_MS = 65;

type ScrambleTitleProps = {
  className: string;
  russian: string;
  english: string;
};

export default function ScrambleTitle({ className, russian, english }: ScrambleTitleProps) {
  const [isEnglish, setIsEnglish] = useState(false);
  const [displayText, setDisplayText] = useState(russian);
  const [scale, setScale] = useState(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef(russian);
  const pointerTypeRef = useRef("");
  const target = isEnglish ? english : russian;

  useEffect(() => {
    const heading = headingRef.current;
    const trigger = triggerRef.current;
    if (!heading || !trigger) return;
    const fit = () => setScale(Math.min(1, heading.clientWidth / trigger.offsetWidth));
    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    observer.observe(trigger);
    fit();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (textRef.current === target) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const startedAt = performance.now();
    const updateText = (text: string) => {
      textRef.current = text;
      setDisplayText(text);
    };
    const settle = () => {
      window.clearTimeout(timer);
      updateText(target);
    };
    const frame = () => {
      const progress = Math.min((performance.now() - startedAt) / SCRAMBLE_MS, 1);
      const lockedLetters = Math.floor(progress * target.length);
      updateText(target.split("").map((letter, index) =>
        letter === " " || index < lockedLetters
          ? letter
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      ).join(""));
      if (progress < 1) timer = window.setTimeout(frame, FRAME_MS);
    };

    if (reducedMotion.matches) settle();
    else frame();
    reducedMotion.addEventListener("change", settle);
    return () => {
      window.clearTimeout(timer);
      reducedMotion.removeEventListener("change", settle);
    };
  }, [target]);

  return (
    <h2 ref={headingRef} className={`${className} ${styles.title}`}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        style={{ transform: `scale(${scale})` }}
        aria-label={`${russian} / ${english}`}
        aria-pressed={isEnglish}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") setIsEnglish(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") setIsEnglish(false);
        }}
        onPointerDown={(event) => { pointerTypeRef.current = event.pointerType; }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) setIsEnglish(true);
        }}
        onBlur={() => setIsEnglish(false)}
        onClick={(event) => {
          if (pointerTypeRef.current === "touch" || event.detail === 0) {
            setIsEnglish((value) => !value);
          }
        }}
      >
        <span className={styles.reserve} aria-hidden="true">{russian}_</span>
        <span className={styles.reserve} aria-hidden="true">{english}_</span>
        <span className={styles.visible} aria-hidden="true">
          <span>{displayText}</span>
          <i className={styles.cursor} />
        </span>
      </button>
    </h2>
  );
}
