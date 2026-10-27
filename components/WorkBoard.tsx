"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import { staticWorkItems } from "../data/workItems";
import { adminCategories, type PublicCase } from "../data/adminTypes";
import { useBoardPan } from "../hooks/useBoardPan";
import { useCaseTransition } from "./CaseTransition";

const filters = ["Избранное", ...adminCategories] as const;
type WorkFilter = (typeof filters)[number];

type WorkItem = { slug:string; title:string; type:string; description:string; cover?:string; number:string; visual:string; ratio:string; ratioLabel:string; category:string; favorite:boolean; year:string; industry:string; singleWork?:boolean };

const previewEase = [0.22, 1, 0.36, 1] as const;

function WorkVisual({ item }: { item: WorkItem }) {
  return (
    <div
      className={`work-board-art work-board-art--${item.visual}`}
      style={{ aspectRatio: item.ratio }}
    >
      {item.cover ? (
        <Image
          src={item.cover}
          alt={`${item.title} — ${item.type.toLowerCase()}`}
          fill
          sizes="(max-width: 767px) 200px, (max-width: 2559px) 54vw, 1382px"
          className="work-board-cover"
        />
      ) : (
        <>
          <span className="work-placeholder-index">PROJECT {item.number}</span>
          <strong>{item.ratioLabel}</strong>
          <span className="work-placeholder-note">MEDIA PLACEHOLDER</span>
        </>
      )}
    </div>
  );
}

function coverBounds(element: Element, layer: Element) {
  const rect = element.getBoundingClientRect();
  const base = layer.getBoundingClientRect();
  return { x: rect.x - base.x, y: rect.y - base.y, width: rect.width, height: rect.height };
}

function WorkPreviewFrame({ item, origin, targetRef, open, reducedMotion, onClosed }: {
  item: WorkItem;
  origin: HTMLButtonElement;
  targetRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  reducedMotion: boolean;
  onClosed: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [initialBounds] = useState(() => coverBounds(origin.querySelector(".work-board-art")!, origin.closest(".work-board-viewport")!));
  const [bounds, setBounds] = useState(initialBounds);
  useLayoutEffect(() => {
    // An ancestor ref can attach after this child's layout effect. The frame's
    // own ref is ready here, and its positioned ancestor is already in the DOM.
    const layer = frameRef.current?.closest(".work-detail-backdrop");
    const target = open ? targetRef.current : origin.querySelector(".work-board-art");
    if (!layer || !target) return;
    const measure = () => setBounds(coverBounds(target, layer));
    measure();
    if (!open) return;
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    observer.observe(layer);
    return () => observer.disconnect();
  }, [open, origin, targetRef]);

  return (
    <motion.div ref={frameRef} className="work-preview-frame"
      initial={initialBounds} animate={bounds}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: previewEase }}
      onAnimationComplete={() => { if (!open) onClosed(); }}>
      <WorkVisual item={item} />
    </motion.div>
  );
}

export default function WorkBoard({ extraCases }: {extraCases?:PublicCase[]}) {
  const workItems: WorkItem[] = extraCases ? extraCases.map(item => {
    const original = staticWorkItems.find(work => work.slug === item.slug);
    const originalCover = original && "cover" in original ? original.cover : undefined;
    const keepVisual = original && (item.cover?.src ?? undefined) === originalCover;
    return {...item, cover:item.cover?.src, visual:keepVisual ? original.visual : "uploaded",
      ratio:keepVisual ? original.ratio : item.cover ? item.cover.width + " / " + item.cover.height : "1 / 1",
      ratioLabel:keepVisual ? original.ratioLabel : item.cover ? item.cover.width + ":" + item.cover.height : "1:1"};
  }) : [...staticWorkItems];
  const pagePositionRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const previewTargetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const navigateToCase = useCaseTransition();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [isPreviewPresent, setIsPreviewPresent] = useState(false);
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("Избранное");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const requestedFilterRef = useRef<WorkFilter>("Избранное");
  const visibleItems = workItems.filter((item) =>
    activeFilter === "Избранное" ? item.favorite : item.category === activeFilter,
  ).sort((a, b) => Number(b.slug === "project-07") - Number(a.slug === "project-07"));
  const isBoardDisabled = isPreviewPresent || isFadingOut;
  const mediaRatios = visibleItems.map(item => {
    const [width, height] = item.ratio.split("/").map(Number);
    return width > 0 && height > 0 ? width / height : 1;
  });
  const cardWidths = mediaRatios.map(ratio => Math.max(1, ratio));
  const rows = Array.from({ length: Math.ceil(visibleItems.length / 5) }, (_, row) => mediaRatios.slice(row * 5, row * 5 + 5));
  const rowWidths = rows.map(ratios => ratios.reduce((sum, ratio) => sum + Math.max(1, ratio), 0));
  const rowHeights = rows.map(ratios => Math.max(1, ...ratios.map(ratio => 1 / ratio)));

  const openCase = (slug: string) => {
    if (isBoardDisabled) return;
    pagePositionRef.current = window.scrollY;
    setIsPreviewPresent(true);
    setPreviewSlug(slug);
    setSelectedSlug(slug);
  };

  const selectedItem = workItems.find((item) => item.slug === selectedSlug);
  const previewItem = workItems.find((item) => item.slug === previewSlug);

  useLayoutEffect(() => {
    // Restore focus after React removes inert from the returning card's canvas.
    if (!isPreviewPresent) triggerRef.current?.focus({ preventScroll: true });
  }, [isPreviewPresent]);

  useLayoutEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("section") !== "work" && !url.hash.startsWith("#work")) return;
    const section = document.getElementById("work");
    if (!section) return;
    url.searchParams.delete("section");
    url.hash = "work";
    window.history.replaceState(window.history.state, "", url);
    window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top, behavior: "instant" });
  }, []);

  const { viewportRef, canvasRef, offset, backgroundPosition, isDragging, handlers } = useBoardPan({
    disabled: isBoardDisabled,
    verticalOnCompact: true,
    panPadding: 0.25,
    onActivate: (item) => {
      triggerRef.current = item;
      openCase(item.dataset.boardItem!);
    },
  });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!selectedSlug || !viewport) return;
    // Focusing a partly clipped card can scroll the overflow container.
    // Keep the detail layer anchored to its visible viewport before paint.
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
    window.scrollTo({ top: pagePositionRef.current, behavior: "instant" });
  }, [selectedSlug]);

  useEffect(() => {
    if (!selectedSlug) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedSlug(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedSlug]);

  return (
    <div className="work-board-shell">
      <div
        ref={viewportRef}
        className={`work-board-viewport board-edge-shade${isDragging ? " is-dragging" : ""}${isPreviewPresent ? " has-selection" : ""}${selectedItem ? " is-open" : ""}`}
        {...handlers}
      >
        <motion.div
          className="work-board-grid"
          aria-hidden="true"
          style={{ backgroundPosition }}
        />
        <motion.div
          ref={canvasRef}
          className="work-board-canvas"
          style={{
            x: offset.x,
            y: offset.y,
            ...{
              "--work-row-count": Math.ceil(visibleItems.length / 5),
              "--work-item-count": visibleItems.length,
              "--work-board-width-units": Math.max(1, ...rowWidths),
              "--work-board-height-units": rowHeights.reduce((sum, height) => sum + height, 0),
              "--work-mobile-width-units": cardWidths.reduce((sum, width) => sum + width, 0),
              "--work-mobile-height-units": Math.max(1, ...mediaRatios.map(ratio => 1 / ratio)),
            } as CSSProperties,
          }}
          aria-hidden={isPreviewPresent}
          inert={isBoardDisabled}
        >
          <motion.div
            className="work-board-items"
            initial={false}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : isFadingOut ? 0.16 : 0.24 }}
            onAnimationComplete={() => {
              if (!isFadingOut) return;
              setActiveFilter(requestedFilterRef.current);
              setIsFadingOut(false);
            }}
            style={{ pointerEvents: isFadingOut ? "none" : "auto" }}
          >
          {Array.from({ length: Math.ceil(visibleItems.length / 5) }, (_, row) => (
            <div className="work-board-row" key={`${activeFilter}-${row}`}>
          {visibleItems.slice(row * 5, row * 5 + 5).map((item, rowIndex) => {
            const index = row * 5 + rowIndex;
            return (
            <button
              key={`${activeFilter}-${item.slug}`}
              type="button"
              className={`work-board-card work-board-card--${item.visual} work-board-card--slot-${index + 1}`}
              data-work-slug={item.slug}
              data-board-item={item.slug}
              data-preview-source={previewSlug === item.slug || undefined}
              style={{
                "--work-slot": index,
                "--work-media-ratio": Number(item.ratio.split("/")[0]) / Number(item.ratio.split("/")[1]),
                "--work-width-before": cardWidths.slice(0, index).reduce((sum, width) => sum + width, 0),
              } as CSSProperties}
              aria-label={`Открыть проект ${item.title}`}
              tabIndex={isBoardDisabled ? -1 : 0}
              onClick={(event) => {
                if (event.detail !== 0) return;
                triggerRef.current = event.currentTarget;
                openCase(item.slug);
              }}
            >
              <span className="work-board-card-meta">
                <span>CASE {item.number}</span>
                <span>{item.type}</span>
              </span>
              <WorkVisual item={item} />
              <span className="work-board-card-title">
                {item.title}
                <b>↗</b>
              </span>
            </button>
            );
          })}
            </div>
          ))}
          </motion.div>
        </motion.div>

              {selectedItem ? (
              <button
                type="button"
                className="work-detail-close board-dismiss"
                aria-label="Закрыть просмотр проекта"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedSlug(null);
                }}
              >
                ЗАКРЫТЬ <span className="text-accent-red-bright">[×]</span>
              </button>
              ) : null}

          {previewItem && triggerRef.current ? (
            <div
              className="work-detail-backdrop"
              onWheel={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                if ((event.target as Element).closest("a, .work-detail-visual, .work-detail-copy, .work-preview-frame")) return;
                setSelectedSlug(null);
              }}
            >
              <motion.div className="work-detail-shade" aria-hidden="true"
                initial={{ opacity: 0 }} animate={{ opacity: selectedItem ? 1 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: previewEase }} />


              <div
                className="work-detail"
                style={{
                  "--work-detail-ratio": Number(previewItem.ratio.split("/")[0]) /
                    Number(previewItem.ratio.split("/")[1]),
                } as CSSProperties}
                role="dialog"
                aria-modal="true"
                aria-labelledby="work-detail-title"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <div className="work-detail-visual">
                  <div ref={previewTargetRef} className="work-preview-target" style={{ aspectRatio: previewItem.ratio }} />
                </div>

                <motion.div
                  className="work-detail-copy"
                  inert={!selectedItem}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                  animate={{ opacity: selectedItem ? 1 : 0, y: selectedItem || prefersReducedMotion ? 0 : 8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : selectedItem ? 0.3 : 0.15, delay: selectedItem && !prefersReducedMotion ? 0.2 : 0 }}
                >
                  <p className="work-detail-index">CASE {previewItem.number} / {previewItem.year}</p>
                  <h3 id="work-detail-title">{previewItem.title}</h3>
                  <p className="work-detail-type">{previewItem.type}</p>
                  <p className="work-detail-description">{previewItem.description}</p>
                  <p className="work-detail-industry">СФЕРА — {previewItem.industry}</p>
                  {!previewItem.singleWork && <Link className="work-detail-link" href={`/work/${previewItem.slug}`} onNavigate={(event) => {
                    event.preventDefault();
                    navigateToCase(`/work/${previewItem.slug}`, previewItem.number);
                  }}>
                    СМОТРЕТЬ КЕЙС <span>↗</span>
                  </Link>}
                </motion.div>
              </div>
              <WorkPreviewFrame item={previewItem} origin={triggerRef.current}
                targetRef={previewTargetRef}
                open={Boolean(selectedItem)} reducedMotion={Boolean(prefersReducedMotion)}
                onClosed={() => {
                  setIsPreviewPresent(false);
                  setPreviewSlug(null);
                }} />
            </div>
          ) : null}
      </div>

      <div className="work-board-filters" role="group" aria-label="Фильтр работ">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="work-board-filter"
            aria-pressed={activeFilter === filter}
            disabled={isPreviewPresent}
            onClick={() => {
              if (filter === activeFilter && !isFadingOut) return;
              requestedFilterRef.current = filter;
              if (prefersReducedMotion) {
                setActiveFilter(filter);
                setIsFadingOut(false);
              } else {
                setIsFadingOut(true);
              }
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="work-board-hint" aria-hidden="true">
        <span>ЗАЖМИТЕ И ТЯНИТЕ</span> / НАЖМИТЕ ДЛЯ ПРОСМОТРА
      </p>
    </div>
  );
}
