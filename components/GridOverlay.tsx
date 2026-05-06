"use client";

import { useEffect, useState } from "react";
import styles from "./GridOverlay.module.css";

const GRID_COLUMNS = 12;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

export default function GridOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTypingTarget(event.target) ||
        event.key.toLowerCase() !== "t"
      ) {
        return;
      }

      setIsVisible((currentValue) => !currentValue);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.rows} />
      <div className={styles.columns}>
        {Array.from({ length: GRID_COLUMNS }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
