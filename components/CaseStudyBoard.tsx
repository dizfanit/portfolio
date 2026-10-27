"use client";

// @refresh reset

import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { caseStudySections, type CaseStudy } from "../data/caseStudies";
import { useBoardPan } from "../hooks/useBoardPan";
import { usePreviewScroll } from "../hooks/usePreviewScroll";
import { useCaseTransition } from "./CaseTransition";
import styles from "./CaseStudyBoard.module.css";

const previewEase = [0.22, 1, 0.36, 1] as const;

function frameBounds(element: HTMLElement) {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x, y, width, height };
}

function CaseMediaPreview({ media, origin, open, reducedMotion, onClosed, onClose }: {
  media: CaseStudy["media"][number];
  origin: HTMLButtonElement;
  open: boolean;
  reducedMotion: boolean;
  onClosed: () => void;
  onClose: () => void;
}) {
  const scrollPreview = media.kind === "website";
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [initialBounds] = useState(() => frameBounds(origin));
  const [imageWidth, setImageWidth] = useState(initialBounds.width);
  const [settled, setSettled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const frameX = useMotionValue(initialBounds.x);
  const frameY = useMotionValue(initialBounds.y);
  const frameWidth = useMotionValue(initialBounds.width);
  const frameHeight = useMotionValue(initialBounds.height);
  const imageScale = useTransform(frameWidth, width => width / imageWidth);
  const closedRef = useRef(onClosed);
  closedRef.current = onClosed;
  const contentY = useMotionValue(0);
  const duration = reducedMotion ? 0 : 0.6;
  usePreviewScroll(scrollerRef, open && settled && scrollPreview, reducedMotion);

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const dismiss = target.closest("dialog")?.querySelector<HTMLButtonElement>(`button.${styles.close}`);
    let lastDismissWidth = -1;
    const syncDismissWidth = () => {
      if (!dismiss) return;
      const width = dismiss.getBoundingClientRect().width;
      if (width === lastDismissWidth) return;
      lastDismissWidth = width;
      target.style.setProperty("--case-preview-dismiss-width", `${width}px`);
    };
    syncDismissWidth();
    let cancelled = false;
    let animations: ReturnType<typeof animate>[] = [];
    let lastBounds: ReturnType<typeof frameBounds> | undefined;
    const travel = (bounds: ReturnType<typeof frameBounds>) => {
      if (lastBounds && Object.keys(bounds).every(key => bounds[key as keyof typeof bounds] === lastBounds![key as keyof typeof bounds])) return;
      lastBounds = bounds;
      animations.forEach(animation => animation.stop());
      if (open) setImageWidth(bounds.width);
      animations = [
        animate(frameX, bounds.x, { duration, ease: previewEase }),
        animate(frameY, bounds.y, { duration, ease: previewEase }),
        animate(frameWidth, bounds.width, { duration, ease: previewEase }),
        animate(frameHeight, bounds.height, { duration, ease: previewEase }),
      ];
      void Promise.all(animations).then(() => {
        if (cancelled) return;
        if (open) setSettled(true);
        else closedRef.current();
      });
    };
    let contentAnimation: ReturnType<typeof animate> | undefined;
    if (!open) {
      const scroller = scrollerRef.current;
      // Transfer scroll into translation before resizing the clipping frame.
      if (scroller) {
        contentY.set(-scroller.scrollTop);
        scroller.scrollTop = 0;
      }
      contentAnimation = animate(contentY, 0, { duration, ease: previewEase });
    }
    travel(frameBounds(open ? target : origin));
    const observer = new ResizeObserver(() => {
      syncDismissWidth();
      if (open) travel(frameBounds(target));
    });
    if (open) observer.observe(target);
    if (open && dismiss) observer.observe(dismiss);
    return () => {
      cancelled = true;
      observer.disconnect();
      animations.forEach(animation => animation.stop());
      contentAnimation?.stop();
    };
  }, [open, origin, scrollPreview, contentY, duration, frameX, frameY, frameWidth, frameHeight]);

  useEffect(() => {
    if (open && scrollPreview) scrollerRef.current?.focus({ preventScroll: true });
  }, [open, scrollPreview]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !open || !settled || !scrollPreview) return;
    const measure = () => setCanScroll(scroller.scrollHeight > scroller.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    return () => observer.disconnect();
  }, [open, settled, scrollPreview]);

  const showScrollHint = open && settled && canScroll && isAtTop;

  return (
    <div className={styles.previewLayer} data-open={open} onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <motion.div className={styles.previewBackdrop} aria-hidden="true"
        initial={{ opacity: 0 }} animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration, ease: previewEase }} />
      <div ref={targetRef} aria-hidden="true"
        className={`${styles.previewBounds}${scrollPreview ? ` ${styles.pageBounds}` : ""}`}
        style={{ "--preview-ratio": media.width / media.height } as CSSProperties} />
      <motion.div className={styles.previewFrame}
        style={{ x: frameX, y: frameY, width: frameWidth, height: frameHeight }}>
        <div ref={scrollerRef} className={styles.previewScroller}
          data-scrollable={scrollPreview && open && settled}
          onScroll={(event) => {
            if (!open || !settled) return;
            const top = event.currentTarget.scrollTop;
            setIsAtTop(previous => top <= 1 ? true : top > 8 ? false : previous);
          }}
          tabIndex={scrollPreview && open ? 0 : undefined}
          role={scrollPreview ? "region" : undefined}
          aria-label={scrollPreview ? `Прокрутка страницы: ${media.title}` : undefined}>
          <motion.div className={styles.previewContent} style={{ y: contentY }}>
            <motion.div className={styles.previewImage} style={{ width: imageWidth, scale: imageScale }}>
            <Image src={media.src} alt={media.alt} width={media.width} height={media.height}
              sizes={scrollPreview ? "90vw" : "70vw"} loading="eager" draggable={false} />
            </motion.div>
          </motion.div>
        </div>
        {scrollPreview ? (
          <motion.div className={styles.scrollHint} aria-hidden="true"
            data-visible={showScrollHint}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: showScrollHint ? 1 : 0, y: showScrollHint || reducedMotion ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: previewEase }}>
            <svg className={styles.scrollMouse} width="32" height="40" viewBox="0 0 32 40" fill="none">
              <rect x="7" y="2" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="1.5" />
              <path className={styles.scrollWheel} d="M16 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="m12 35 4 3 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={styles.scrollTouch} width="32" height="40" viewBox="0 0 32 40" fill="none">
              <path className={styles.scrollGesture} d="M10 35 5 24c-1-3 2-5 4-2l3 4V12a2.5 2.5 0 0 1 5 0v9l2-2 3 2 3-1 3 3v6l-3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.5 6V1m-3 3 3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Листайте вниз</span>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}

export default function CaseStudyBoard({ study }: { study: CaseStudy }) {
  const navigateToWork = useCaseTransition();
  const [openSection, setOpenSection] = useState<string | undefined>(caseStudySections[0].id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnRef = useRef<HTMLAnchorElement>(null);
  const [actionBounds, setActionBounds] = useState<{ top: number; right: number; height: number }>();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reducedMotion = useReducedMotion();
  const selectedMedia = selectedIndex === null ? null : study.media[selectedIndex];
  const pageLayout = study.mediaLayout === "pages";
  const { viewportRef, canvasRef, offset, backgroundPosition, isDragging, handlers } = useBoardPan({
    disabled: selectedIndex !== null,
    verticalOnCompact: true,
    centered: true,
    onActivate: (item) => openPreview(item),
  });

  const openPreview = (item: HTMLButtonElement) => {
    triggerRef.current = item;
    const action = returnRef.current?.getBoundingClientRect();
    if (action) setActionBounds({ top: action.top, right: window.innerWidth - action.right, height: action.height });
    dialogRef.current?.showModal();
    setSelectedIndex(Number(item.dataset.boardItem));
    setPreviewOpen(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selectedIndex !== null && dialog && !dialog.open) dialog.showModal();
  }, [selectedIndex]);

  useLayoutEffect(() => {
    if (selectedIndex === null) return;
    const action = returnRef.current;
    if (!action) return;
    const measure = () => {
      const rect = action.getBoundingClientRect();
      setActionBounds({ top: rect.top, right: window.innerWidth - rect.right, height: rect.height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(action);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [selectedIndex !== null]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
    };
  }, [selectedIndex !== null]);

  const closePreview = () => setPreviewOpen(false);
  const finishPreview = () => {
    // Restore the source in the same paint that removes the native top layer.
    flushSync(() => {
      setSelectedIndex(null);
      setPreviewOpen(false);
    });
    dialogRef.current?.close();
    triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <main className={styles.page} data-case-number={study.number}>
      <div className={styles.frame} aria-hidden="true">
        {["tl", "tr", "bl", "br"].map((corner) => (
          <span key={corner} className={`section-frame-corner section-frame-corner--${corner}`} />
        ))}
      </div>
      <header className={styles.header}>
        <p className={styles.eyebrow}>DIZFANIT <span>/ CASE {study.number}</span></p>
        <Link
          ref={returnRef}
          className={`board-dismiss ${styles.returnAction}`}
          data-preview-open={previewOpen || undefined}
          href="/#work"
          onNavigate={(event) => {
            event.preventDefault();
            // Navigate without Next's hash scrolling; restore the section after mount.
            navigateToWork("/?section=work", study.number);
          }}
        >
          Вернуться к работам <span aria-hidden="true">[↖]</span>
        </Link>
      </header>
      <div className={styles.layout}>
        <aside className={styles.panel} aria-label="Информация о проекте">
          <div className={styles.panelHeading}>
            <p className={styles.eyebrow}><span>PROJECT FILE / {study.number}</span></p>
            <h1 tabIndex={-1} className={styles.title}>{study.title}<span>.</span></h1>
          </div>
          <dl className={styles.facts}>
            <div><dt>Тип</dt><dd>{study.type}</dd></div>
            <div><dt>Год</dt><dd>{study.year}</dd></div>
            <div><dt>Сфера</dt><dd>{study.industry}</dd></div>
          </dl>
          <div className={styles.accordions}>
            {caseStudySections.filter(section => study.sections[section.id].length > 0).map((section, index) => {
              const isOpen = openSection === section.id;
              return (
                <section key={section.id} className={styles.accordion} data-open={isOpen}>
                  <h2>
                    <button
                      type="button"
                      id={`case-tab-${section.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`case-panel-${section.id}`}
                      onClick={() => setOpenSection(isOpen ? undefined : section.id)}
                      className={styles.accordionButton}
                    >
                      <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                      <span className={styles.toggle} aria-hidden="true">{isOpen ? "−" : "+"}</span>
                    </button>
                  </h2>
                  <motion.div
                    className={styles.accordionBody}
                    id={`case-panel-${section.id}`}
                    role="region"
                    aria-labelledby={`case-tab-${section.id}`}
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                    <div className={styles.accordionContent}>
                      {study.sections[section.id].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  </motion.div>
                </section>
              );
            })}
          </div>
          {study.media.length === 0 ? <p className={styles.emptyNote}>Материалы проекта будут добавлены позже.</p> : null}
        </aside>
      </div>
      <section className={styles.board} aria-label="Доска материалов проекта">
        <div ref={viewportRef} className={`${styles.viewport} board-edge-shade${isDragging ? ` ${styles.dragging}` : ""}`} {...handlers}>
          <motion.div className={styles.grid} aria-hidden="true" style={{ backgroundPosition }} />
          <motion.div
            ref={canvasRef}
            className={`${styles.canvas}${pageLayout ? ` ${styles.pagesCanvas}` : ""}`}
            style={{
              x: offset.x,
              y: offset.y,
              ...{ "--case-columns": Math.max(1, Math.min(3, study.media.length)) } as CSSProperties,
            }}
          >
            {study.media.map((media, index) => (
              <button
                key={`${media.src}-${index}`}
                type="button"
                data-board-item={index}
                data-preview-source={selectedIndex === index || undefined}
                className={styles.mediaCard}
                data-page-slot={pageLayout ? index : undefined}
                style={{ "--media-ratio": media.width / media.height } as CSSProperties}
                aria-label={`Увеличить: ${media.title}`}
                onClick={(event) => {
                  if (event.detail !== 0) return;
                  openPreview(event.currentTarget);
                }}
              >
                <div className={styles.mediaVisual}>
                  <Image src={media.src} alt={media.alt} fill sizes={pageLayout ? "(max-width: 767px) 80vw, 25vw" : "(max-width: 767px) 80vw, 40vw"} draggable={false} />
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </section>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        data-case-preview
        style={actionBounds ? { "--case-preview-action-top": `${actionBounds.top}px`, "--case-preview-action-bottom": `${actionBounds.top + actionBounds.height}px` } as CSSProperties : undefined}
        aria-label={selectedMedia ? selectedMedia.title : "Просмотр материала"}
        onCancel={(event) => { event.preventDefault(); closePreview(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closePreview(); }}
        onKeyDown={(event) => {
          if (!previewOpen || study.media.length < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
          event.preventDefault();
          const index = ((selectedIndex ?? 0) + (event.key === "ArrowRight" ? 1 : -1) + study.media.length) % study.media.length;
          const origin = canvasRef.current?.querySelector<HTMLButtonElement>(`[data-board-item="${index}"]`);
          if (origin) triggerRef.current = origin;
          setSelectedIndex(index);
        }}
        onClose={() => {
          setSelectedIndex(null);
          setPreviewOpen(false);
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        {selectedMedia && triggerRef.current ? (
          <CaseMediaPreview key={selectedIndex} media={selectedMedia} origin={triggerRef.current}
            open={previewOpen} reducedMotion={Boolean(reducedMotion)}
            onClose={closePreview} onClosed={finishPreview} />
        ) : null}
        {previewOpen ? (
          <button type="button" onClick={closePreview} autoFocus className={`board-dismiss ${styles.close}`}
            style={actionBounds}>
            Закрыть <span aria-hidden="true">[×]</span>
          </button>
        ) : null}
      </dialog>
    </main>
  );
}
