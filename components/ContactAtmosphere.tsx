"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./Contact.module.css";

// Coordinates follow contact-world.webp; SVG slice matches its centered cover crop.
const nodes = [
  [1098, 365], [1764, 126], [1716, 380], [1970, 185],
  [1730, 718], [1057, 968], [987, 910],
] as const;

const connections = [
  "M1374 96 L1716 380",
  "M1716 380 L1764 126",
  "M1970 185 L1716 380",
  "M1098 365 Q1206 197 1374 96",
  "M987 910 L1057 968",
] as const;

export default function ContactAtmosphere() {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => {
      svg.dataset.active = String(inView && !document.hidden && !reducedMotion.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { threshold: 0 });

    observer.observe(svg);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <svg ref={svgRef} className={styles.atmosphere} viewBox="0 0 2048 1143"
      preserveAspectRatio="xMidYMid slice" data-active="false" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0.55" className={styles.redStop} stopOpacity="0" />
          <stop offset="0.82" className={styles.redStop} stopOpacity="0.25" />
          <stop offset="1" className={styles.redStop} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-haze`}>
          <stop className={styles.redStop} stopOpacity="0.3" />
          <stop offset="1" className={styles.redStop} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-node`}>
          <stop className={styles.lightStop} stopOpacity="0.8" />
          <stop offset="0.08" className={styles.redStop} stopOpacity="0.85" />
          <stop offset="0.3" className={styles.redStop} stopOpacity="0.32" />
          <stop offset="1" className={styles.redStop} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className={styles.aura}>
        <ellipse cx="1540" cy="660" rx="630" ry="640" fill={`url(#${id}-halo)`} />
        <ellipse cx="1460" cy="190" rx="610" ry="330" fill={`url(#${id}-haze)`} />
      </g>
      <g className={styles.network}>
        {nodes.map(([x, y], index) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <circle className={styles.nodeGlow} r="42" fill={`url(#${id}-node)`}
              style={{ animationDelay: `${-index * 2.7}s`, animationDuration: `${12 + index % 3 * 2}s` }} />
          </g>
        ))}
        {connections.map((path, index) => (
          <g key={path} className={styles.signal}
            style={{ animationDelay: `${-index * 3.9}s`, animationDuration: `${14 + index * 1.5}s` }}>
            <path d={path} pathLength="100" className={styles.signalGlow} />
            <path d={path} pathLength="100" className={styles.signalCore} />
          </g>
        ))}
      </g>
    </svg>
  );
}
