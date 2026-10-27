"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { useMotionTemplate, useReducedMotion, useSpring } from "framer-motion";

const panSpring = { stiffness: 500, damping: 40, mass: 0.65, restDelta: 0.1, restSpeed: 0.1 };

type BoardPanOptions = {
  disabled?: boolean;
  verticalOnCompact?: boolean;
  centered?: boolean;
  /** Extra travel on each edge, as a fraction of the viewport's shorter side. */
  panPadding?: number;
  onActivate: (item: HTMLButtonElement) => void;
};

export function useBoardPan({ disabled = false, verticalOnCompact = false, centered = false, panPadding = 0, onActivate }: BoardPanOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const initializedRef = useRef(false);
  const pointerRef = useRef({ id: -1, x: 0, y: 0, originX: 0, originY: 0, moved: false, item: null as HTMLButtonElement | null });
  const reducedMotion = useReducedMotion();
  const x = useSpring(0, panSpring);
  const y = useSpring(0, panSpring);
  const backgroundPosition = useMotionTemplate`${x}px ${y}px`;
  const [isDragging, setIsDragging] = useState(false);

  useLayoutEffect(() => {
    if (!disabled && !reducedMotion) return;
    x.jump(x.get());
    y.jump(y.get());
    if (disabled && pointerRef.current.id !== -1) {
      const pointerId = pointerRef.current.id;
      pointerRef.current.id = -1;
      setIsDragging(false);
      if (viewportRef.current?.hasPointerCapture(pointerId)) {
        viewportRef.current.releasePointerCapture(pointerId);
      }
    }
  }, [disabled, reducedMotion, x, y]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;
    const updateBounds = () => {
      const padding = Math.max(0, panPadding) * Math.min(viewport.clientWidth, viewport.clientHeight);
      const compact = !verticalOnCompact && window.matchMedia("(max-width: 767px)").matches;
      boundsRef.current = {
        minX: Math.min(0, viewport.clientWidth - canvas.offsetWidth) - padding,
        maxX: padding,
        minY: compact ? 0 : Math.min(0, viewport.clientHeight - canvas.offsetHeight) - padding,
        maxY: compact ? 0 : padding,
      };
      const bounds = boundsRef.current;
      const next = {
        x: centered && !initializedRef.current ? (bounds.minX + bounds.maxX) / 2 : Math.max(bounds.minX, Math.min(bounds.maxX, x.get())),
        y: centered && !initializedRef.current ? (bounds.minY + bounds.maxY) / 2 : Math.max(bounds.minY, Math.min(bounds.maxY, y.get())),
      };
      // Rebase an active drag if a resize clamps its current position.
      pointerRef.current.originX += next.x - x.get();
      pointerRef.current.originY += next.y - y.get();
      initializedRef.current = true;
      x.jump(next.x);
      y.jump(next.y);
      // The initial bounds can arrive before the template subscribes to x/y.
      backgroundPosition.set(`${next.x}px ${next.y}px`);
    };
    const observer = new ResizeObserver(updateBounds);
    observer.observe(viewport);
    observer.observe(canvas);
    updateBounds();
    return () => observer.disconnect();
  }, [verticalOnCompact, centered, panPadding, x, y, backgroundPosition]);

  const finishPointer = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const pointer = pointerRef.current;
    if (pointer.id !== event.pointerId) return;
    pointerRef.current.id = -1;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && !disabled && !pointer.moved && pointer.item) {
      // Freeze the common board position before shared-layout measurement.
      x.jump(x.get());
      y.jump(y.get());
      onActivate(pointer.item);
    }
  };

  return {
    viewportRef, canvasRef, offset: { x, y }, backgroundPosition, isDragging,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        if (disabled || event.button !== 0 || pointerRef.current.id !== -1) return;
        const item = (event.target as Element).closest<HTMLButtonElement>("button[data-board-item]");
        // Native pointer focus can scroll a clipped card and the whole snap page.
        event.preventDefault();
        item?.focus({ preventScroll: true });
        x.jump(x.get());
        y.jump(y.get());
        pointerRef.current = {
          id: event.pointerId, x: event.clientX, y: event.clientY,
          originX: x.get(), originY: y.get(), moved: false, item,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        const pointer = pointerRef.current;
        if (disabled || pointer.id !== event.pointerId) return;
        const dx = event.clientX - pointer.x;
        const dy = event.clientY - pointer.y;
        if (!pointer.moved && Math.hypot(dx, dy) < 6) return;
        if (!pointer.moved) setIsDragging(true);
        pointer.moved = true;
        const compact = !verticalOnCompact && window.matchMedia("(max-width: 767px)").matches;
        const next = {
          x: Math.max(boundsRef.current.minX, Math.min(boundsRef.current.maxX, pointer.originX + dx)),
          y: Math.max(boundsRef.current.minY, Math.min(boundsRef.current.maxY, pointer.originY + (compact ? 0 : dy))),
        };
        if (reducedMotion) {
          x.jump(next.x);
          y.jump(next.y);
        } else {
          x.set(next.x);
          y.set(next.y);
        }
      },
      onPointerUp: (event: PointerEvent<HTMLDivElement>) => finishPointer(event, false),
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) => finishPointer(event, true),
      onLostPointerCapture: () => {
        pointerRef.current.id = -1;
        setIsDragging(false);
      },
    },
  };
}
