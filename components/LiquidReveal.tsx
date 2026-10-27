"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type Point = {
  x: number;
  y: number;
};

type TrailPoint = Point & {
  createdAt: number;
};

type LiquidRevealProps = {
  baseSrc: string;
  revealSrc: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const brushRadius = 143;
const revealHoldMs = 120;
const revealFadeMs = 1880;
const revealTrailMs = revealHoldMs + revealFadeMs;

export default function LiquidReveal({
  baseSrc,
  revealSrc,
  alt,
  className = "",
  style,
  children,
}: LiquidRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!container || !canvas || !image) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardownEffect = () => {};

    const clearCanvas = () => {
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const setupEffect = () => {
      teardownEffect();

      if (reducedMotion.matches) {
        clearCanvas();
        teardownEffect = () => {};
        return;
      }

      teardownEffect = setupCanvasReveal(container, canvas, image, revealSrc);
    };

    setupEffect();

    reducedMotion.addEventListener("change", setupEffect);

    return () => {
      reducedMotion.removeEventListener("change", setupEffect);
      teardownEffect();
    };
  }, [revealSrc]);

  return (
    <div
      ref={containerRef}
      className={["liquid-reveal", className].filter(Boolean).join(" ")}
      style={style}
    >
      <img
        ref={imageRef}
        className="liquid-reveal__image"
        src={baseSrc}
        alt={alt}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="liquid-reveal__canvas"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function setupCanvasReveal(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  baseImage: HTMLImageElement,
  revealSrc: string,
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return () => {};
  }

  const coverCanvas = document.createElement("canvas");
  const coverContext = coverCanvas.getContext("2d");
  const maskCanvas = document.createElement("canvas");
  const maskContext = maskCanvas.getContext("2d");
  const brushCanvas = document.createElement("canvas");
  const brushContext = brushCanvas.getContext("2d");
  const revealImage = new Image();
  const pendingPoints: TrailPoint[] = [];
  const trailPoints: TrailPoint[] = [];
  const brushSize = brushRadius * 2;
  const interpolationStep = Math.max(brushRadius * 0.18, 18);

  let isDisposed = false;
  let isImageReady = false;
  let animationFrame = 0;
  let previousPoint: Point | null = null;
  let width = 0;
  let height = 0;
  let dpr = 1;

  if (!coverContext || !maskContext || !brushContext) {
    return () => {};
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  coverContext.imageSmoothingEnabled = true;
  coverContext.imageSmoothingQuality = "high";
  maskContext.imageSmoothingEnabled = true;
  maskContext.imageSmoothingQuality = "high";
  brushContext.imageSmoothingEnabled = true;
  brushContext.imageSmoothingQuality = "high";

  const clearMainCanvas = () => {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
  };

  const clearMaskCanvas = () => {
    maskContext.save();
    maskContext.setTransform(1, 0, 0, 1, 0, 0);
    maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskContext.restore();
  };

  const drawCoverImage = () => {
    if (!isImageReady || width <= 0 || height <= 0) {
      return;
    }

    coverContext.save();
    coverContext.setTransform(1, 0, 0, 1, 0, 0);
    coverContext.clearRect(0, 0, coverCanvas.width, coverCanvas.height);
    coverContext.restore();

    coverContext.setTransform(dpr, 0, 0, dpr, 0, 0);

    const imageWidth = revealImage.naturalWidth;
    const imageHeight = revealImage.naturalHeight;
    const scale = Math.max(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const { x: positionX, y: positionY } = getObjectPosition(baseImage);
    const drawX = (width - drawWidth) * positionX;
    const drawY = (height - drawHeight) * positionY;

    coverContext.drawImage(revealImage, drawX, drawY, drawWidth, drawHeight);
  };

  const resizeCanvas = () => {
    if (isDisposed) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextCanvasWidth = Math.round(nextWidth * nextDpr);
    const nextCanvasHeight = Math.round(nextHeight * nextDpr);
    const nextBrushSize = Math.round(brushSize * nextDpr);
    const didSizeChange =
      canvas.width !== nextCanvasWidth ||
      canvas.height !== nextCanvasHeight ||
      brushCanvas.width !== nextBrushSize ||
      brushCanvas.height !== nextBrushSize;

    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;

    if (!didSizeChange) {
      drawCoverImage();
      return;
    }

    canvas.width = nextCanvasWidth;
    canvas.height = nextCanvasHeight;
    coverCanvas.width = canvas.width;
    coverCanvas.height = canvas.height;
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    brushCanvas.width = nextBrushSize;
    brushCanvas.height = nextBrushSize;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    brushContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    clearMainCanvas();
    maskContext.clearRect(0, 0, width, height);
    pendingPoints.length = 0;
    trailPoints.length = 0;
    previousPoint = null;

    drawCoverImage();
  };

  const stampMask = (point: Point, opacity: number) => {
    brushContext.save();
    brushContext.globalCompositeOperation = "source-over";
    brushContext.globalAlpha = 1;
    brushContext.clearRect(0, 0, brushSize, brushSize);

    const gradient = brushContext.createRadialGradient(
      brushRadius,
      brushRadius,
      0,
      brushRadius,
      brushRadius,
      brushRadius,
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.82)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    brushContext.fillStyle = gradient;
    brushContext.fillRect(0, 0, brushSize, brushSize);
    brushContext.restore();

    maskContext.save();
    maskContext.globalCompositeOperation = "source-over";
    maskContext.globalAlpha = opacity;
    maskContext.drawImage(
      brushCanvas,
      point.x - brushRadius,
      point.y - brushRadius,
      brushSize,
      brushSize,
    );
    maskContext.restore();
  };

  const drawRevealFromMask = () => {
    clearMainCanvas();

    context.save();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.drawImage(coverCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.drawImage(maskCanvas, 0, 0, width, height);
    context.restore();
  };

  const renderFrame = (timestamp: number) => {
    animationFrame = 0;

    if (isDisposed || !isImageReady || width <= 0 || height <= 0) {
      return;
    }

    const points = pendingPoints.splice(0);
    trailPoints.push(...points);

    let expiredPointCount = 0;

    while (
      expiredPointCount < trailPoints.length &&
      timestamp - trailPoints[expiredPointCount].createdAt >= revealTrailMs
    ) {
      expiredPointCount += 1;
    }

    if (expiredPointCount > 0) {
      trailPoints.splice(0, expiredPointCount);
    }

    if (trailPoints.length === 0) {
      clearMaskCanvas();
      clearMainCanvas();
      return;
    }

    clearMaskCanvas();

    for (const point of trailPoints) {
      const fadeProgress = Math.min(
        Math.max((timestamp - point.createdAt - revealHoldMs) / revealFadeMs, 0),
        1,
      );
      const easedFadeProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);

      stampMask(point, 1 - easedFadeProgress);
    }

    drawRevealFromMask();

    if (pendingPoints.length > 0 || trailPoints.length > 0) {
      animationFrame = window.requestAnimationFrame(renderFrame);
    }
  };

  const scheduleRender = () => {
    if (animationFrame === 0) {
      animationFrame = window.requestAnimationFrame(renderFrame);
    }
  };

  const enqueuePoint = (point: Point) => {
    const createdAt = performance.now();

    if (!previousPoint) {
      pendingPoints.push({ ...point, createdAt });
      previousPoint = point;
      scheduleRender();
      return;
    }

    const distance = Math.hypot(
      point.x - previousPoint.x,
      point.y - previousPoint.y,
    );
    const steps = Math.max(
      1,
      Math.min(80, Math.ceil(distance / interpolationStep)),
    );

    for (let index = 1; index <= steps; index += 1) {
      const progress = index / steps;

      pendingPoints.push({
        x: previousPoint.x + (point.x - previousPoint.x) * progress,
        y: previousPoint.y + (point.y - previousPoint.y) * progress,
        createdAt,
      });
    }

    previousPoint = point;
    scheduleRender();
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isImageReady) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (
      point.x < 0 ||
      point.y < 0 ||
      point.x > rect.width ||
      point.y > rect.height
    ) {
      previousPoint = null;
      return;
    }

    enqueuePoint(point);
  };

  const resetPreviousPoint = () => {
    previousPoint = null;
  };

  const handleImageLoad = () => {
    if (isDisposed || revealImage.naturalWidth === 0) {
      return;
    }

    isImageReady = true;
    resizeCanvas();
  };

  const resizeObserver = new ResizeObserver(resizeCanvas);

  resizeObserver.observe(container);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });
  window.addEventListener("pointercancel", resetPreviousPoint);

  revealImage.onload = handleImageLoad;
  revealImage.src = revealSrc;

  if (revealImage.complete) {
    handleImageLoad();
  } else {
    resizeCanvas();
  }

  return () => {
    isDisposed = true;
    resizeObserver.disconnect();
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointercancel", resetPreviousPoint);
    revealImage.onload = null;

    if (animationFrame !== 0) {
      window.cancelAnimationFrame(animationFrame);
    }

    clearMainCanvas();
  };
}

function getObjectPosition(image: HTMLImageElement) {
  const objectPosition = window.getComputedStyle(image).objectPosition;
  const [x = "50%", y = "50%"] = objectPosition.split(" ");

  return {
    x: parseObjectPositionAxis(x),
    y: parseObjectPositionAxis(y),
  };
}

function parseObjectPositionAxis(value: string) {
  if (value === "left" || value === "top") {
    return 0;
  }

  if (value === "right" || value === "bottom") {
    return 1;
  }

  if (value === "center") {
    return 0.5;
  }

  if (value.endsWith("%")) {
    const percentage = Number.parseFloat(value);

    if (Number.isFinite(percentage)) {
      return percentage / 100;
    }
  }

  return 0.5;
}
