"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_POOL_SIZE = 48;
const TRAIL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GRID_SIZE = 18;
const TILE_SIZE = 18;
const TILE_VISIBLE_MS = 220;
const TILE_FADE_MS = 100;
const CELL_TRIGGER_INTERVAL_MS = 120;
const ACTIVE_CELL_LIMIT = 160;

const CLUSTER_PATTERNS = [
  [
    { col: -1, row: -1 },
    { col: 0, row: -1 },
    { col: 1, row: -1 },
    { col: 2, row: -1 },
    { col: -1, row: 0 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: -2, row: 1 },
    { col: -1, row: 1 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
    { col: 0, row: 2 },
  ],
  [
    { col: -1, row: -2 },
    { col: 0, row: -2 },
    { col: -1, row: -1 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 2, row: 0 },
    { col: -1, row: 1 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
    { col: 2, row: 1 },
    { col: 0, row: 2 },
    { col: 1, row: 2 },
  ],
  [
    { col: -2, row: -1 },
    { col: -1, row: -1 },
    { col: 0, row: -1 },
    { col: -1, row: 0 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 2, row: 0 },
    { col: -1, row: 1 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
    { col: 0, row: 2 },
    { col: 1, row: 2 },
  ],
  [
    { col: -2, row: -2 },
    { col: -1, row: -2 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 2 },
    { col: -2, row: -1 },
    { col: -1, row: -1 },
    { col: 0, row: -1 },
    { col: 1, row: -1 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
  ],
];

type Point = {
  x: number;
  y: number;
};

type Cell = {
  col: number;
  row: number;
};

function getRandomTrailChar() {
  return TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)] ?? "0";
}

function getCell(point: Point): Cell {
  return {
    col: Math.floor(point.x / GRID_SIZE),
    row: Math.floor(point.y / GRID_SIZE),
  };
}

function getCellKey(cell: Cell) {
  return `${cell.col}:${cell.row}`;
}

function getCellCenter(cell: Cell): Point {
  return {
    x: cell.col * GRID_SIZE + GRID_SIZE / 2,
    y: cell.row * GRID_SIZE + GRID_SIZE / 2,
  };
}

function getClusterPattern() {
  const pattern =
    CLUSTER_PATTERNS[Math.floor(Math.random() * CLUSTER_PATTERNS.length)] ??
    CLUSTER_PATTERNS[0];
  const rotation = Math.floor(Math.random() * 4);
  const mirror = Math.random() > 0.5 ? -1 : 1;

  return pattern.map((cell) => {
    const mirroredCol = cell.col * mirror;

    if (rotation === 1) {
      return { col: -cell.row, row: mirroredCol };
    }

    if (rotation === 2) {
      return { col: -mirroredCol, row: -cell.row };
    }

    if (rotation === 3) {
      return { col: cell.row, row: -mirroredCol };
    }

    return { col: mirroredCol, row: cell.row };
  });
}

export default function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const targetRef = useRef<Point>({ x: -100, y: -100 });
  const nextTrailIndexRef = useRef(0);
  const lastCellKeyRef = useRef("");
  const lastCellTriggerRef = useRef(0);
  const activeCellsRef = useRef(new Map<string, number>());
  const trailTimeoutsRef = useRef<Array<number | undefined>>([]);

  useEffect(() => {
    const cursorMedia = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    const reducedMotionMedia = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updateEnabled = () => {
      setIsEnabled(
        cursorMedia.matches &&
          !reducedMotionMedia.matches &&
          navigator.maxTouchPoints === 0,
      );
    };

    updateEnabled();
    cursorMedia.addEventListener("change", updateEnabled);
    reducedMotionMedia.addEventListener("change", updateEnabled);

    return () => {
      cursorMedia.removeEventListener("change", updateEnabled);
      reducedMotionMedia.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let hasPointerPosition = false;
    const root = rootRef.current;

    const showCursor = () => {
      if (!root || hasPointerPosition) {
        return;
      }

      hasPointerPosition = true;
      root.style.opacity = "1";
    };

    const hideCursor = () => {
      hasPointerPosition = false;
      if (root) {
        root.style.opacity = "0";
      }
    };

    const fadeTrailNode = (node: HTMLDivElement) => {
      node.style.opacity = "0";
    };

    const pruneActiveCells = (now: number) => {
      if (activeCellsRef.current.size < ACTIVE_CELL_LIMIT) {
        return;
      }

      activeCellsRef.current.forEach((expiresAt, key) => {
        if (expiresAt <= now) {
          activeCellsRef.current.delete(key);
        }
      });
    };

    const spawnTrailNode = (cell: Cell, now: number) => {
      const cellKey = getCellKey(cell);
      const expiresAt = activeCellsRef.current.get(cellKey);

      if (expiresAt !== undefined && expiresAt > now) {
        return;
      }

      activeCellsRef.current.set(cellKey, now + TILE_VISIBLE_MS);
      const index = nextTrailIndexRef.current;
      const node = trailRefs.current[index];
      nextTrailIndexRef.current = (index + 1) % TRAIL_POOL_SIZE;

      if (!node) {
        return;
      }

      const center = getCellCenter(cell);
      const left = Math.round(center.x - TILE_SIZE / 2);
      const top = Math.round(center.y - TILE_SIZE / 2);

      node.textContent = getRandomTrailChar();
      node.style.width = `${TILE_SIZE}px`;
      node.style.height = `${TILE_SIZE}px`;
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      node.style.opacity = "0";

      const previousTimeoutId = trailTimeoutsRef.current[index];
      if (previousTimeoutId !== undefined) {
        window.clearTimeout(previousTimeoutId);
      }

      window.requestAnimationFrame(() => {
        node.style.opacity = "1";
      });

      trailTimeoutsRef.current[index] = window.setTimeout(() => {
        fadeTrailNode(node);
      }, TILE_VISIBLE_MS - TILE_FADE_MS);
    };

    const spawnGridCluster = (point: Point) => {
      const now = performance.now();
      const centerCell = getCell(point);
      const cellKey = getCellKey(centerCell);

      if (
        cellKey === lastCellKeyRef.current ||
        now - lastCellTriggerRef.current < CELL_TRIGGER_INTERVAL_MS
      ) {
        return;
      }

      lastCellKeyRef.current = cellKey;
      lastCellTriggerRef.current = now;
      pruneActiveCells(now);

      const pattern = getClusterPattern();

      pattern.forEach((offset) => {
        spawnTrailNode(
          {
            col: centerCell.col + offset.col,
            row: centerCell.row + offset.row,
          },
          now,
        );
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        hideCursor();
        return;
      }

      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      showCursor();
      spawnGridCluster(targetRef.current);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", hideCursor);
      trailTimeoutsRef.current.forEach((timeoutId) => {
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      });
      trailTimeoutsRef.current = [];
      activeCellsRef.current.clear();
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[10000] opacity-0 transition-opacity duration-150"
      ref={rootRef}
    >
      {Array.from({ length: TRAIL_POOL_SIZE }, (_, index) => (
        <div
          className="fixed left-0 top-0 flex h-[18px] w-[18px] select-none items-center justify-center overflow-hidden bg-accent-red-bright font-mono text-[10px] font-bold leading-none text-black opacity-0 transition-opacity duration-100 ease-out will-change-[opacity]"
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
        />
      ))}
    </div>
  );
}
