"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type Cell = {
  col: number;
  row: number;
};

const CURRENT_CLUSTER_POOL_SIZE = 36;
const TRAIL_TILE_POOL_SIZE = 144;
const CLUSTER_POOL_SIZE = CURRENT_CLUSTER_POOL_SIZE + TRAIL_TILE_POOL_SIZE;
const CLUSTER_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWYZ0123456789<>/\\|%-=()[]{}:;";
const GRID_SIZE = 18;
const TILE_SIZE = 18;
const CLUSTER_IDLE_MS = 80;
const IDLE_FADE_STAGGER_MS = 13;
const SHRINK_FADE_STAGGER_MS = 6;
const TRAIL_VISIBLE_MS = 74;
const TRAIL_FADE_MS = 112;
const TRAIL_MIN_SPEED = 0.45;
const MAX_TRAIL_SNAPSHOTS = 1;
const MIN_TRAIL_CELLS = 3;
const MAX_TRAIL_CELLS = 8;
const TRAIL_MAX_ROW_RADIUS = 2;
const TRAIL_MAX_COL_RADIUS = 3;
const MIN_CLUSTER_CELLS = 7;
const MAX_CLUSTER_CELLS = 11;
const MIN_CLUSTER_SPEED = 0.08;
const MAX_CLUSTER_SPEED = 1.75;

const CLUSTER_PATTERNS: Cell[][] = [
  [
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 0, row: 1 },
    { col: -1, row: 0 },
    { col: 1, row: -1 },
    { col: -1, row: 1 },
    { col: 0, row: -1 },
    { col: 1, row: 1 },
    { col: -1, row: -1 },
    { col: 2, row: 0 },
    { col: 0, row: 2 },
    { col: 2, row: -1 },
    { col: -2, row: 1 },
    { col: 1, row: 2 },
    { col: -2, row: 0 },
    { col: 2, row: 1 },
    { col: 0, row: -2 },
    { col: -1, row: 2 },
    { col: 1, row: -2 },
    { col: -2, row: -1 },
    { col: 2, row: 2 },
    { col: -2, row: 2 },
    { col: 2, row: -2 },
    { col: -2, row: -2 },
    { col: 3, row: 0 },
    { col: 0, row: 3 },
    { col: -3, row: 0 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: -3, row: 1 },
    { col: 0, row: -3 },
    { col: 3, row: -1 },
    { col: -1, row: 3 },
    { col: 1, row: -3 },
    { col: -3, row: -1 },
  ],
  [
    { col: 0, row: 0 },
    { col: 0, row: -1 },
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: -1 },
    { col: -1, row: -1 },
    { col: -1, row: 1 },
    { col: 1, row: 1 },
    { col: 0, row: -2 },
    { col: 1, row: -2 },
    { col: -1, row: -2 },
    { col: 2, row: 0 },
    { col: 2, row: -1 },
    { col: -2, row: 0 },
    { col: -2, row: -1 },
    { col: 2, row: -2 },
    { col: -2, row: -2 },
    { col: 0, row: 2 },
    { col: 1, row: 2 },
    { col: -1, row: 2 },
    { col: 2, row: 1 },
    { col: -2, row: 1 },
    { col: 2, row: 2 },
    { col: -2, row: 2 },
    { col: 0, row: -3 },
    { col: 1, row: -3 },
    { col: -1, row: -3 },
    { col: 3, row: 0 },
    { col: 3, row: 1 },
    { col: -3, row: 0 },
    { col: 0, row: 3 },
    { col: -3, row: -1 },
    { col: 1, row: 3 },
  ],
  [
    { col: 0, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: 0 },
    { col: -1, row: 1 },
    { col: 0, row: -1 },
    { col: 1, row: 1 },
    { col: -1, row: -1 },
    { col: 1, row: -1 },
    { col: -2, row: 0 },
    { col: 0, row: 2 },
    { col: -2, row: 1 },
    { col: 2, row: 0 },
    { col: -1, row: 2 },
    { col: 2, row: 1 },
    { col: 0, row: -2 },
    { col: -2, row: -1 },
    { col: 1, row: -2 },
    { col: 1, row: 2 },
    { col: -1, row: -2 },
    { col: 2, row: -1 },
    { col: -2, row: 2 },
    { col: 2, row: 2 },
    { col: -2, row: -2 },
    { col: 2, row: -2 },
    { col: -3, row: 0 },
    { col: 0, row: 3 },
    { col: 3, row: 0 },
    { col: -3, row: 1 },
    { col: -1, row: 3 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 0, row: -3 },
    { col: -3, row: -1 },
    { col: 1, row: -3 },
  ],
  [
    { col: 0, row: 0 },
    { col: 0, row: -1 },
    { col: -1, row: 0 },
    { col: 1, row: 0 },
    { col: 0, row: 1 },
    { col: -1, row: -1 },
    { col: 1, row: -1 },
    { col: 1, row: 1 },
    { col: -1, row: 1 },
    { col: 0, row: -2 },
    { col: -2, row: 0 },
    { col: 1, row: -2 },
    { col: -2, row: -1 },
    { col: 2, row: 0 },
    { col: 2, row: -1 },
    { col: -1, row: -2 },
    { col: 0, row: 2 },
    { col: -2, row: 1 },
    { col: -1, row: 2 },
    { col: 1, row: 2 },
    { col: 2, row: 1 },
    { col: -2, row: 2 },
    { col: -2, row: -2 },
    { col: 2, row: -2 },
    { col: 2, row: 2 },
    { col: 0, row: -3 },
    { col: -3, row: 0 },
    { col: 1, row: -3 },
    { col: -3, row: -1 },
    { col: 3, row: 0 },
    { col: 3, row: -1 },
    { col: 0, row: 3 },
    { col: -3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 1 },
  ],
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getRandomClusterChar() {
  return CLUSTER_CHARS[Math.floor(Math.random() * CLUSTER_CHARS.length)] ?? "0";
}

function getClusterCellCount(speed: number) {
  const normalized = clamp(
    (speed - MIN_CLUSTER_SPEED) / (MAX_CLUSTER_SPEED - MIN_CLUSTER_SPEED),
    0,
    1,
  );
  const eased = normalized * normalized * (3 - 2 * normalized);

  return Math.round(
    MIN_CLUSTER_CELLS + eased * (MAX_CLUSTER_CELLS - MIN_CLUSTER_CELLS),
  );
}

function getTrailCellCount(speed: number) {
  const normalized = clamp(
    (speed - TRAIL_MIN_SPEED) / (MAX_CLUSTER_SPEED - TRAIL_MIN_SPEED),
    0,
    1,
  );
  const eased = normalized * normalized * (3 - 2 * normalized);

  return Math.round(
    MIN_TRAIL_CELLS + eased * (MAX_TRAIL_CELLS - MIN_TRAIL_CELLS),
  );
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

function addUniqueCell(cells: Cell[], usedKeys: Set<string>, cell: Cell) {
  const key = getCellKey(cell);

  if (usedKeys.has(key)) {
    return false;
  }

  usedKeys.add(key);
  cells.push(cell);
  return true;
}

function shuffleCells(cells: Cell[]) {
  const shuffled = [...cells];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex] ?? current;
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

function getTrailFragment(pattern: Cell[], cellCount: number) {
  const targetCount = Math.min(pattern.length, cellCount);
  const densePool = pattern
    .slice(0, Math.min(pattern.length, targetCount + 8))
    .filter(
      (cell) =>
        Math.abs(cell.row) <= TRAIL_MAX_ROW_RADIUS &&
        Math.abs(cell.col) <= TRAIL_MAX_COL_RADIUS,
    );
  const shuffledDensePool = shuffleCells(densePool);
  const fragment: Cell[] = [];
  const usedKeys = new Set<string>();
  const denseCellCount = Math.max(3, Math.round(targetCount * 0.65));

  shuffledDensePool.forEach((cell) => {
    if (fragment.length >= denseCellCount) {
      return;
    }

    if (cell.col === 0 && cell.row === 0 && Math.random() < 0.5) {
      return;
    }

    if (Math.random() < 0.18) {
      return;
    }

    addUniqueCell(fragment, usedKeys, cell);
  });

  pattern.slice(0, 6).forEach((cell) => {
    if (fragment.length >= Math.max(4, Math.round(targetCount * 0.45))) {
      return;
    }

    if (
      Math.abs(cell.row) > TRAIL_MAX_ROW_RADIUS ||
      Math.abs(cell.col) > TRAIL_MAX_COL_RADIUS
    ) {
      return;
    }

    addUniqueCell(fragment, usedKeys, cell);
  });

  for (
    let attempts = 0;
    fragment.length < targetCount && attempts < 80;
    attempts += 1
  ) {
    const base =
      densePool[Math.floor(Math.random() * densePool.length)] ?? pattern[0];

    if (!base) {
      break;
    }

    const candidate = {
      col: base.col + Math.floor(Math.random() * 3) - 1,
      row: base.row + Math.floor(Math.random() * 3) - 1,
    };

    if (
      candidate.col === 0 &&
      candidate.row === 0 &&
      Math.random() < 0.65
    ) {
      continue;
    }

    if (
      Math.abs(candidate.row) > TRAIL_MAX_ROW_RADIUS ||
      Math.abs(candidate.col) > TRAIL_MAX_COL_RADIUS
    ) {
      continue;
    }

    addUniqueCell(fragment, usedKeys, candidate);
  }

  return shuffleCells(fragment);
}

function getCellCenter(cell: Cell): Point {
  return {
    x: cell.col * GRID_SIZE + GRID_SIZE / 2,
    y: cell.row * GRID_SIZE + GRID_SIZE / 2,
  };
}

function getMotionRotation(point: Point, previousPoint: Point | null) {
  if (!previousPoint) {
    return Math.floor(Math.random() * 4);
  }

  const deltaX = point.x - previousPoint.x;
  const deltaY = point.y - previousPoint.y;

  if (Math.hypot(deltaX, deltaY) < GRID_SIZE / 2) {
    return Math.floor(Math.random() * 4);
  }

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX >= 0 ? 0 : 2;
  }

  return deltaY >= 0 ? 1 : 3;
}

function rotateCell(cell: Cell, rotation: number): Cell {
  if (rotation === 1) {
    return { col: -cell.row, row: cell.col };
  }

  if (rotation === 2) {
    return { col: -cell.col, row: -cell.row };
  }

  if (rotation === 3) {
    return { col: cell.row, row: -cell.col };
  }

  return cell;
}

function getRandomClusterCells(cellCount: number) {
  const targetCount = clamp(cellCount, MIN_CLUSTER_CELLS, MAX_CLUSTER_CELLS);
  const cells: Cell[] = [];
  const usedKeys = new Set<string>();
  const neighborOffsets: Cell[] = [
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 0, row: -1 },
  ];

  addUniqueCell(cells, usedKeys, { col: 0, row: 0 });

  for (
    let attempts = 0;
    cells.length < targetCount && attempts < 180;
    attempts += 1
  ) {
    const candidates = cells.flatMap((cell) => {
      return neighborOffsets.map((offset) => {
        return {
          col: cell.col + offset.col,
          row: cell.row + offset.row,
        };
      });
    });
    const rankedCandidates = shuffleCells(candidates)
      .filter((candidate) => {
        if (usedKeys.has(getCellKey(candidate))) {
          return false;
        }

        return Math.abs(candidate.col) <= 2 && Math.abs(candidate.row) <= 2;
      })
      .map((candidate) => {
        const neighborCount = neighborOffsets.filter((offset) => {
          return usedKeys.has(
            getCellKey({
              col: candidate.col + offset.col,
              row: candidate.row + offset.row,
            }),
          );
        }).length;
        const centerWeight =
          5 - Math.abs(candidate.col) - Math.abs(candidate.row);

        return {
          cell: candidate,
          score: neighborCount * 8 + centerWeight + Math.random() * 2,
        };
      })
      .sort((a, b) => b.score - a.score);
    const pickedCell = rankedCandidates[0]?.cell;

    if (pickedCell) {
      addUniqueCell(cells, usedKeys, pickedCell);
    }
  }

  const fallbackCells: Cell[] = [
    { col: -1, row: 0 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: -1, row: 1 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
    { col: 0, row: -1 },
    { col: 2, row: 1 },
    { col: -2, row: 0 },
    { col: 2, row: 0 },
    { col: -2, row: 1 },
  ];

  fallbackCells.forEach((cell) => {
    if (cells.length < targetCount) {
      addUniqueCell(cells, usedKeys, cell);
    }
  });

  return cells;
}

function getClusterPattern(
  point: Point,
  previousPoint: Point | null,
  cellCount: number,
) {
  const rotation = getMotionRotation(point, previousPoint);
  const mirror = Math.random() > 0.5 ? -1 : 1;

  return getRandomClusterCells(cellCount).map((cell) => {
    return rotateCell({ col: cell.col * mirror, row: cell.row }, rotation);
  });
}

export default function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);
  const latestPointRef = useRef<Point | null>(null);
  const previousClusterPointRef = useRef<Point | null>(null);
  const previousMovePointRef = useRef<Point | null>(null);
  const previousMoveTimeRef = useRef(0);
  const pointerSpeedRef = useRef(0);
  const lastCellKeyRef = useRef("");
  const lastClusterSizeRef = useRef(0);
  const visibleTileCountRef = useRef(0);
  const activeTileIndexesRef = useRef<number[]>([]);
  const nextTrailTileIndexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | undefined>(undefined);
  const fadeTimeoutsRef = useRef<number[]>([]);
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

    function clearFadeTimers() {
      fadeTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      fadeTimeoutsRef.current = [];
      tileRefs.current.forEach((node) => {
        if (node) {
          node.style.transitionDelay = "0ms";
        }
      });
    }

    function clearTrailTimers() {
      trailTimeoutsRef.current.forEach((timeoutId) => {
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      });
      trailTimeoutsRef.current = [];
    }

    function spawnTrailTile(centerCell: Cell, offset: Cell, opacity: number) {
      const trailSlot = nextTrailTileIndexRef.current;
      const index = CURRENT_CLUSTER_POOL_SIZE + trailSlot;
      const node = tileRefs.current[index];
      nextTrailTileIndexRef.current =
        (trailSlot + 1) % TRAIL_TILE_POOL_SIZE;

      if (!node) {
        return;
      }

      const previousTimeoutId = trailTimeoutsRef.current[trailSlot];

      if (previousTimeoutId !== undefined) {
        window.clearTimeout(previousTimeoutId);
      }

      const center = getCellCenter({
        col: centerCell.col + offset.col,
        row: centerCell.row + offset.row,
      });
      const left = Math.round(center.x - TILE_SIZE / 2);
      const top = Math.round(center.y - TILE_SIZE / 2);
      const tileOpacity = opacity * (0.72 + Math.random() * 0.28);
      const fadeDelay = Math.round(TRAIL_VISIBLE_MS * (0.65 + Math.random()));
      const fadeDuration = Math.round(TRAIL_FADE_MS * (0.75 + Math.random()));

      node.textContent = getRandomClusterChar();
      node.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      node.style.transitionDelay = "0ms";
      node.style.transitionDuration = "0ms";
      node.style.zIndex = "1";
      node.style.opacity = `${tileOpacity}`;

      window.requestAnimationFrame(() => {
        node.style.transitionDuration = `${fadeDuration}ms`;
      });

      trailTimeoutsRef.current[trailSlot] = window.setTimeout(() => {
        node.style.opacity = "0";
      }, fadeDelay);
    }

    function spawnTrailSnapshots(
      point: Point,
      previousPoint: Point | null,
      pattern: Cell[],
      speed: number,
    ) {
      if (!previousPoint || speed < TRAIL_MIN_SPEED) {
        return;
      }

      const distance = Math.hypot(
        point.x - previousPoint.x,
        point.y - previousPoint.y,
      );
      const snapshotCount = clamp(
        Math.ceil(distance / (GRID_SIZE * 2)),
        1,
        MAX_TRAIL_SNAPSHOTS,
      );
      const trailCellCount = Math.min(pattern.length, getTrailCellCount(speed));
      const normalizedSpeed = clamp(
        (speed - TRAIL_MIN_SPEED) / (MAX_CLUSTER_SPEED - TRAIL_MIN_SPEED),
        0,
        1,
      );
      const baseOpacity = 0.5 + normalizedSpeed * 0.22;

      for (let snapshot = 1; snapshot <= snapshotCount; snapshot += 1) {
        const progress = snapshot / (snapshotCount + 1);
        const samplePoint = {
          x: previousPoint.x + (point.x - previousPoint.x) * progress,
          y: previousPoint.y + (point.y - previousPoint.y) * progress,
        };
        const sampleCell = getCell(samplePoint);
        sampleCell.col += Math.floor(Math.random() * 3) - 1;
        const snapshotOpacity =
          baseOpacity * (0.55 + (snapshot / snapshotCount) * 0.35);
        const trailFragment = getTrailFragment(pattern, trailCellCount);

        trailFragment.forEach((offset) => {
          spawnTrailTile(sampleCell, offset, snapshotOpacity);
        });
      }
    }

    function fadeTiles(indexes: number[], staggerMs: number) {
      indexes.forEach((index, order) => {
        const timeoutId = window.setTimeout(() => {
          const node = tileRefs.current[index];

          if (node) {
            node.style.opacity = "0";
          }
        }, order * staggerMs);

        fadeTimeoutsRef.current.push(timeoutId);
      });
    }

    function hideCluster(staggered: boolean) {
      clearFadeTimers();

      if (!staggered) {
        clearTrailTimers();
        tileRefs.current.forEach((node) => {
          if (node) {
            node.style.opacity = "0";
          }
        });
        visibleTileCountRef.current = 0;
        activeTileIndexesRef.current = [];
        nextTrailTileIndexRef.current = 0;
        return;
      }

      const activeIndexes =
        activeTileIndexesRef.current.length > 0
          ? activeTileIndexesRef.current
          : Array.from(
              { length: visibleTileCountRef.current },
              (_, index) => index,
            );

      fadeTiles([...activeIndexes].reverse(), IDLE_FADE_STAGGER_MS);
      visibleTileCountRef.current = 0;
      activeTileIndexesRef.current = [];
    }

    function showCursor() {
      if (!root || hasPointerPosition) {
        return;
      }

      hasPointerPosition = true;
      root.style.opacity = "1";
    }

    function hideCursor() {
      hasPointerPosition = false;
      if (root) {
        root.style.opacity = "0";
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (idleTimeoutRef.current !== undefined) {
        window.clearTimeout(idleTimeoutRef.current);
      }
      animationFrameRef.current = null;
      idleTimeoutRef.current = undefined;
      latestPointRef.current = null;
      previousClusterPointRef.current = null;
      previousMovePointRef.current = null;
      previousMoveTimeRef.current = 0;
      pointerSpeedRef.current = 0;
      lastCellKeyRef.current = "";
      lastClusterSizeRef.current = 0;
      hideCluster(false);
    }

    function resetIdleTimeout() {
      if (idleTimeoutRef.current !== undefined) {
        window.clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = window.setTimeout(() => {
        hideCluster(true);
        previousClusterPointRef.current = null;
        pointerSpeedRef.current = 0;
        lastCellKeyRef.current = "";
        lastClusterSizeRef.current = 0;
      }, CLUSTER_IDLE_MS);
    }

    function renderCluster() {
      animationFrameRef.current = null;
      const point = latestPointRef.current;

      if (!point) {
        return;
      }

      const centerCell = getCell(point);
      const cellKey = getCellKey(centerCell);
      const cellCount = getClusterCellCount(pointerSpeedRef.current);

      if (
        cellKey === lastCellKeyRef.current &&
        cellCount === lastClusterSizeRef.current
      ) {
        resetIdleTimeout();
        return;
      }

      const previousActiveIndexes = activeTileIndexesRef.current;
      clearFadeTimers();

      lastCellKeyRef.current = cellKey;
      lastClusterSizeRef.current = cellCount;
      const previousPoint = previousClusterPointRef.current;
      previousClusterPointRef.current = point;

      const pattern = getClusterPattern(point, previousPoint, cellCount);
      spawnTrailSnapshots(
        point,
        previousPoint,
        pattern,
        pointerSpeedRef.current,
      );
      const activeIndexes = pattern.map((_, index) => index);
      const activeIndexSet = new Set(activeIndexes);
      const staleIndexes = previousActiveIndexes.filter(
        (index) => !activeIndexSet.has(index),
      );
      const staleIndexSet = new Set(staleIndexes);

      pattern.forEach((offset, index) => {
        const node = tileRefs.current[index];

        if (!node) {
          return;
        }

        const center = getCellCenter({
          col: centerCell.col + offset.col,
          row: centerCell.row + offset.row,
        });
        const left = Math.round(center.x - TILE_SIZE / 2);
        const top = Math.round(center.y - TILE_SIZE / 2);

        node.textContent = getRandomClusterChar();
        node.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        node.style.transitionDelay = "0ms";
        node.style.transitionDuration = "0ms";
        node.style.zIndex = "2";
        node.style.opacity = "1";
      });

      for (
        let index = pattern.length;
        index < CURRENT_CLUSTER_POOL_SIZE;
        index += 1
      ) {
        if (staleIndexSet.has(index)) {
          continue;
        }

        const node = tileRefs.current[index];

        if (node) {
          node.style.opacity = "0";
        }
      }

      if (staleIndexes.length > 0) {
        fadeTiles(staleIndexes.reverse(), SHRINK_FADE_STAGGER_MS);
      }

      visibleTileCountRef.current = pattern.length;
      activeTileIndexesRef.current = activeIndexes;
      resetIdleTimeout();
    }

    function requestClusterRender() {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(renderCluster);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType && event.pointerType !== "mouse") {
        hideCursor();
        return;
      }

      const point = {
        x: event.clientX,
        y: event.clientY,
      };
      const now = event.timeStamp || performance.now();
      const previousPoint = previousMovePointRef.current;
      const previousTime = previousMoveTimeRef.current;

      if (previousPoint && previousTime > 0) {
        const distance = Math.hypot(
          point.x - previousPoint.x,
          point.y - previousPoint.y,
        );
        const elapsed = Math.max(now - previousTime, 8);
        const speed = distance / elapsed;
        pointerSpeedRef.current =
          pointerSpeedRef.current === 0
            ? speed
            : pointerSpeedRef.current * 0.35 + speed * 0.65;
      } else {
        pointerSpeedRef.current = 0;
      }

      previousMovePointRef.current = point;
      previousMoveTimeRef.current = now;
      latestPointRef.current = point;
      showCursor();
      requestClusterRender();
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", hideCursor);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (idleTimeoutRef.current !== undefined) {
        window.clearTimeout(idleTimeoutRef.current);
      }
      animationFrameRef.current = null;
      idleTimeoutRef.current = undefined;
      latestPointRef.current = null;
      previousClusterPointRef.current = null;
      previousMovePointRef.current = null;
      previousMoveTimeRef.current = 0;
      pointerSpeedRef.current = 0;
      lastCellKeyRef.current = "";
      lastClusterSizeRef.current = 0;
      hideCluster(false);
      clearFadeTimers();
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
      {Array.from({ length: CLUSTER_POOL_SIZE }, (_, index) => (
        <div
          className="fixed left-0 top-0 flex h-[18px] w-[18px] select-none items-center justify-center overflow-hidden bg-accent-red-bright font-mono text-[10px] font-bold leading-none text-black opacity-0 transition-opacity duration-100 ease-out will-change-[transform,opacity]"
          key={index}
          ref={(node) => {
            tileRefs.current[index] = node;
          }}
        />
      ))}
    </div>
  );
}
