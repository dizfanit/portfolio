"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import styles from "./CaseTransition.module.css";

type Transition = { href: string; number: string; scroll: boolean };
const TransitionContext = createContext<(href: string, number: string) => void>(() => {});
const CELL_SIZE = 18; // Same grid as CustomCursor.
const SYMBOLS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/[]%+=:";
const SWEEP_MS = 1400;
const SWEEP_STEPS = 84;
const FALLBACK_PHASE_MS = 650;

function smoothStep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function createWaveField(columns: number, spacing: number) {
  const knots = Array.from({ length: Math.ceil(columns / spacing) + 1 }, () => Math.random() * 2 - 1);
  return Float32Array.from({ length: columns }, (_, col) => {
    const position = col / spacing;
    const index = Math.floor(position);
    const blend = smoothStep(position - index);
    return knots[index] * (1 - blend) + knots[index + 1] * blend;
  });
}

function createPixelSweep(canvas: HTMLCanvasElement, number: string) {
  const context = canvas.getContext("2d");
  if (!context) return null;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const columns = Math.ceil(width / CELL_SIZE);
  const rows = Math.ceil(height / CELL_SIZE);
  const band = Math.min(height * 0.36, CELL_SIZE * 28);
  const palette = getComputedStyle(canvas);
  const atlas = document.createElement("canvas");
  const symbols = SYMBOLS + number;
  atlas.width = CELL_SIZE * symbols.length * dpr;
  atlas.height = CELL_SIZE * dpr;
  const atlasContext = atlas.getContext("2d");
  if (!atlasContext) return null;
  atlasContext.scale(dpr, dpr);
  atlasContext.fillStyle = palette.getPropertyValue("--pixel-color");
  atlasContext.fillRect(0, 0, CELL_SIZE * symbols.length, CELL_SIZE);
  atlasContext.fillStyle = "#050505";
  atlasContext.font = `${palette.fontWeight} ${palette.fontSize} ${palette.fontFamily}`;
  atlasContext.textAlign = "center";
  atlasContext.textBaseline = "middle";
  for (let i = 0; i < symbols.length; i++) {
    atlasContext.fillText(symbols[i], i * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 + 0.5);
  }
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);
  const profiles = Array.from({ length: 4 }, () => {
    const broad = createWaveField(columns, Math.max(1, columns / (3 + Math.random() * 3)));
    const detail = createWaveField(columns, Math.max(1, columns / (10 + Math.random() * 6)));
    return Float32Array.from(broad, (value, col) => (value * 0.16 + detail[col] * 0.055) * height);
  });
  const widthField = createWaveField(columns, Math.max(1, columns / 8));
  const delays = Float32Array.from(widthField, (value, col) => {
    const distance = Math.abs((col + 0.5) / columns - 0.5) * 2;
    return Math.pow(distance, 1.35) * (0.26 + value * 0.035);
  });
  const jitter = Float32Array.from({ length: columns }, () => (Math.random() - 0.5) * CELL_SIZE * 3);
  const initialBand = band * 1.75;
  const start = -initialBand * 0.28 - CELL_SIZE;
  const end = height + band * 1.2 + CELL_SIZE * 2;
  const frames = Array.from({ length: SWEEP_STEPS + 1 }, () => ({
    edges: new Float32Array(columns), bands: new Float32Array(columns),
  }));
  for (let step = 0; step <= SWEEP_STEPS; step++) {
    const progress = step / SWEEP_STEPS;
    const shapeTime = progress * (profiles.length - 1);
    const shapeIndex = Math.min(profiles.length - 2, Math.floor(shapeTime));
    const blend = smoothStep(shapeTime - shapeIndex);
    const thickness = band * (1 + 0.75 * (1 - smoothStep(progress / 0.48)));
    for (let col = 0; col < columns; col++) {
      const local = Math.max(0, (progress - delays[col]) / (1 - delays[col]));
      const shape = profiles[shapeIndex][col] * (1 - blend) + profiles[shapeIndex + 1][col] * blend;
      const edge = start + local * (end - start) + (shape + jitter[col]) * Math.sin(Math.PI * local);
      // Once eaten, a part of the old screen must never appear again.
      frames[step].edges[col] = Math.max(step ? frames[step - 1].edges[col] : start,
        Math.floor(edge / CELL_SIZE) * CELL_SIZE);
      frames[step].bands[col] = thickness * (1 + widthField[col] * 0.18) * smoothStep(local / 0.065);
    }
  }
  const seeds = Float32Array.from({ length: columns * rows }, () => Math.random());
  const glyphs = Uint8Array.from(seeds, (seed) => Math.floor(seed * symbols.length));
  function sample(col: number, progress: number, field: "edges" | "bands") {
    const position = Math.max(0, Math.min(1, progress)) * SWEEP_STEPS;
    const index = Math.min(SWEEP_STEPS - 1, Math.floor(position));
    const blend = position - index;
    return frames[index][field][col] * (1 - blend) + frames[index + 1][field][col] * blend;
  }

  // Complete cells are removed from the old snapshot. The dense centre hides
  // interpolation between mask frames; scattered cells feather its edges.
  function clipPath(progress: number) {
    const points: string[] = [];
    for (let col = 0; col < columns; col++) {
      const y = Math.max(0, Math.min(height, sample(col, progress, "edges")));
      points.push(`${col * CELL_SIZE}px ${y}px`, `${Math.min(width, (col + 1) * CELL_SIZE)}px ${y}px`);
    }
    return `polygon(${points.join(",")},${width}px ${height}px,0px ${height}px)`;
  }

  function draw(progress: number, time: number, phase: "sweep" | "cover" | "reveal" = "sweep") {
    context!.clearRect(0, 0, width, height);
    const tick = Math.floor(time / 85);
    for (let col = 0; col < columns; col++) {
      const edge = sample(col, progress, "edges");
      const spread = sample(col, progress, "bands");
      const firstRow = phase === "cover" ? 0 : Math.max(0, Math.floor((edge - spread) / CELL_SIZE));
      const lastRow = phase === "reveal" ? rows : Math.min(rows, Math.ceil((edge + spread) / CELL_SIZE));
      for (let row = firstRow; row < lastRow; row++) {
        const y = row * CELL_SIZE;
        const index = row * columns + col;
        const distance = Math.abs(y + CELL_SIZE / 2 - edge) / Math.max(1, spread);
        const solid = (phase === "cover" && y < edge) || (phase === "reveal" && y >= edge);
        const density = distance < 0.1 ? 1 : Math.pow(Math.max(0, 1 - distance), 1.7) * 0.95;
        if (!solid && seeds[index] > density) continue;
        const glyph = (glyphs[index] + tick) % symbols.length;
        context!.drawImage(atlas, glyph * CELL_SIZE * dpr, 0, CELL_SIZE * dpr, CELL_SIZE * dpr,
          col * CELL_SIZE, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  return { draw, clipPath };
}

function animateSweep(
  duration: number, draw: (progress: number, time: number) => void,
  signal: AbortSignal, animation?: Animation,
) {
  return new Promise<void>((resolve) => {
    let frame = 0;
    const start = performance.now();
    const finish = () => {
      cancelAnimationFrame(frame);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const render = (time: number) => {
      if (signal.aborted) { finish(); return; }
      const elapsed = animation ? Number(animation.currentTime ?? 0) : time - start;
      const progress = Math.min(1, elapsed / duration);
      draw(progress, time);
      if (progress >= 1 || animation?.playState === "finished" || animation?.playState === "idle") finish();
      else frame = requestAnimationFrame(render);
    };
    signal.addEventListener("abort", finish, { once: true });
    if (signal.aborted) finish();
    else frame = requestAnimationFrame(render);
  });
}

export function useCaseTransition() { return useContext(TransitionContext); }

export default function CaseTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [transition, setTransition] = useState<Transition | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const busyRef = useRef(false);
  const navigatedRef = useRef(false);
  const focusTargetRef = useRef("main h1");

  useEffect(() => {
    if (!transition && navigatedRef.current) {
      document.querySelector<HTMLElement>(focusTargetRef.current)?.focus({ preventScroll: true });
      navigatedRef.current = false;
    }
  }, [transition]);

  useEffect(() => {
    if (!transition) return;
    const canvas = canvasRef.current;
    const sweep = canvas && createPixelSweep(canvas, transition.number);
    if (!sweep) {
      router.push(transition.href, { scroll: transition.scroll });
      busyRef.current = false;
      setTransition(null);
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    const root = document.documentElement;
    let viewTransition: ViewTransition | undefined;
    let maskAnimation: Animation | undefined;
    let routeTimer: number | undefined;
    let routeCheckTimer: number | undefined;
    const cancel = () => controller.abort();
    window.addEventListener("resize", cancel, { once: true });

    const changeRoute = () => new Promise<void>((resolve, reject) => {
      if (signal.aborted) { resolve(); return; }
      const finish = () => {
        window.clearTimeout(routeTimer);
        window.clearTimeout(routeCheckTimer);
        signal.removeEventListener("abort", finish);
        resolve();
      };
      const destinationPath = new URL(transition.href, window.location.href).pathname;
      const checkRoute = () => {
        const target = document.querySelector<HTMLElement>(transition.scroll ? "main[data-case-number]" : "#work");
        const ready = target && (transition.scroll
          ? target.dataset.caseNumber === transition.number
          : Math.abs(target.getBoundingClientRect().top) < 1);
        if (window.location.pathname === destinationPath && ready) finish();
        else routeCheckTimer = window.setTimeout(checkRoute, 16);
      };
      signal.addEventListener("abort", finish, { once: true });
      routeTimer = window.setTimeout(() => {
        reject(new Error("Case navigation timed out"));
        finish();
      }, 8000);
      navigatedRef.current = true;
      router.push(transition.href, { scroll: transition.scroll });
      // Capture the destination only after its DOM and Work scroll position are ready.
      checkRoute();
    });

    async function run() {
      try {
        if (typeof document.startViewTransition === "function") {
          root.classList.add(styles.native);
          viewTransition = document.startViewTransition(changeRoute);
          void viewTransition.updateCallbackDone.catch(() => {});
          void viewTransition.finished.catch(() => {});
          await viewTransition.ready;
          if (signal.aborted) return;
          maskAnimation = root.animate(
            Array.from({ length: SWEEP_STEPS + 1 }, (_, index) => ({
              clipPath: sweep!.clipPath(index / SWEEP_STEPS), offset: index / SWEEP_STEPS,
            })),
            { duration: SWEEP_MS, easing: "linear", fill: "forwards", pseudoElement: "::view-transition-old(root)" },
          );
          await animateSweep(SWEEP_MS, sweep!.draw, signal, maskAnimation);
          viewTransition.skipTransition();
          await viewTransition.finished;
        } else {
          await animateSweep(FALLBACK_PHASE_MS, (p, t) => sweep!.draw(p, t, "cover"), signal);
          if (signal.aborted) return;
          await changeRoute();
          if (signal.aborted) return;
          await animateSweep(FALLBACK_PHASE_MS, (p, t) => sweep!.draw(p, t, "reveal"), signal);
        }
      } catch {
        viewTransition?.skipTransition();
        if (!navigatedRef.current && !signal.aborted) {
          navigatedRef.current = true;
          router.push(transition!.href, { scroll: transition!.scroll });
        }
      } finally {
        maskAnimation?.cancel();
        root.classList.remove(styles.native);
        window.clearTimeout(routeTimer);
        window.clearTimeout(routeCheckTimer);
        window.removeEventListener("resize", cancel);
        busyRef.current = false;
        if (!signal.aborted) setTransition(null);
      }
    }
    void run();
    const onAbort = () => {
      viewTransition?.skipTransition();
      maskAnimation?.cancel();
      root.classList.remove(styles.native);
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        router.push(transition.href, { scroll: transition.scroll });
      }
      busyRef.current = false;
      setTransition(null);
    };
    signal.addEventListener("abort", onAbort, { once: true });
    return () => {
      signal.removeEventListener("abort", onAbort);
      controller.abort();
      viewTransition?.skipTransition();
      maskAnimation?.cancel();
      root.classList.remove(styles.native);
      window.clearTimeout(routeTimer);
      window.clearTimeout(routeCheckTimer);
      window.removeEventListener("resize", cancel);
    };
  }, [transition, router]);

  const navigate = (href: string, number: string) => {
    if (busyRef.current) return;
    const destination = new URL(href, window.location.href);
    const returnToWork = destination.pathname === "/" && destination.searchParams.get("section") === "work";
    const scroll = !returnToWork;
    focusTargetRef.current = returnToWork ? "#work .work-title button" : "main h1";
    if (reducedMotion || pathname === destination.pathname) { router.push(href, { scroll }); return; }
    busyRef.current = true;
    navigatedRef.current = false;
    router.prefetch(href);
    setTransition({ href, number, scroll });
  };

  return (
    <TransitionContext.Provider value={navigate}>
      <div inert={Boolean(transition)}>{children}</div>
      {transition ? (
        <canvas ref={canvasRef} className={styles.overlay} aria-hidden="true" />
      ) : null}
    </TransitionContext.Provider>
  );
}
