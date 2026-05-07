export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-site-bg text-text-primary">
      <video
        className="absolute inset-0 h-full w-full object-cover object-[88%_center] opacity-95 2xl:object-[78%_center]"
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/hero-background-poster.jpg"
        preload="auto"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.9)_26%,rgba(5,5,5,0.5)_50%,rgba(5,5,5,0.08)_78%,rgba(5,5,5,0.42)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_35%_52%,rgba(139,0,0,0.18),transparent_31%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(0deg,rgba(230,226,218,0.7)_0px,rgba(230,226,218,0.7)_1px,transparent_1px,transparent_4px)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px)] bg-[length:6px_6px]"
        aria-hidden="true"
      />

      <div
        className="hero-guide-frame pointer-events-none absolute border border-transparent"
        aria-hidden="true"
      >
        <span className="hero-corner-x absolute left-0 top-0 h-px bg-text-primary/45" />
        <span className="hero-corner-y absolute left-0 top-0 w-px bg-text-primary/45" />
        <span className="hero-corner-x absolute right-0 top-0 h-px bg-text-primary/45" />
        <span className="hero-corner-y absolute right-0 top-0 w-px bg-text-primary/45" />
        <span className="hero-corner-x absolute bottom-0 left-0 h-px bg-text-primary/45" />
        <span className="hero-corner-y absolute bottom-0 left-0 w-px bg-text-primary/45" />
        <span className="hero-corner-x absolute bottom-0 right-0 h-px bg-text-primary/45" />
        <span className="hero-corner-y absolute bottom-0 right-0 w-px bg-text-primary/45" />
      </div>

      <div
        className="hero-side-line absolute hidden w-px bg-[repeating-linear-gradient(to_bottom,rgba(230,226,218,0.45)_0_2px,transparent_2px_8px)] xl:block"
        aria-hidden="true"
      />
      <div
        className="hero-side-dot absolute hidden h-2 w-2 bg-accent-red-bright xl:block"
        aria-hidden="true"
      />
      <div className="hero-side-label-left absolute hidden origin-left rotate-90 font-mono text-xs uppercase tracking-[0.44em] text-accent-red-bright xl:block">
        Terminal 01
      </div>
      <div className="hero-side-label-right absolute hidden origin-right rotate-90 font-mono text-xs uppercase tracking-[0.44em] text-accent-red-bright xl:block">
        Creative · Intentional · Impactful
      </div>

      <div
        className="hero-layout-shell relative z-10 flex min-h-screen flex-col justify-between"
      >
        <div className="hero-primary-grid grid flex-1 items-center 2xl:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)]">
          <div className="hero-copy-cell">
            <p className="hero-copy-inset hero-eyebrow font-mono uppercase text-accent-red-bright">
              &gt;_ WEB DESIGNER / VISUAL SYSTEMS
            </p>

            <div className="hero-copy-inset">
              <h1 className="hero-title w-full font-heading font-bold leading-[0.98] tracking-[0.01em] text-text-primary drop-shadow-[0_0_18px_rgba(230,226,218,0.3)]">
                Делаю сайты,
                <br />
                которые
                <br />
                выглядят
                <br />
                не&nbsp;как&nbsp;шаблон
              </h1>

              <p className="hero-lead w-full break-words font-subheading tracking-[0.02em] text-text-muted">
                Проектирую визуальный образ бизнеса: сайты, презентации,
                <br />
                соцсети&nbsp;и digital-упаковку с&nbsp;акцентом
                на&nbsp;сильное первое впечатление.
              </p>

              <div className="hero-action-row flex flex-col md:flex-row">
                <a
                  className="hero-cta hero-cta-primary relative flex w-full items-center justify-between overflow-hidden md:w-auto"
                  href="#work"
                >
                  <span className="hero-cta-label">Смотреть работы</span>
                  <span className="hero-cta-arrow" aria-hidden="true">
                    &#8594;
                  </span>
                </a>

                <a
                  className="hero-cta hero-cta-secondary relative flex w-full items-center justify-between overflow-hidden md:w-auto"
                  href="#contact"
                >
                  <span className="hero-cta-label">Связаться</span>
                  <span className="hero-cta-arrow" aria-hidden="true">
                    &#8594;
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="hero-hud-cell relative hidden h-full min-h-[560px] 2xl:block">
            <div className="hero-status-panel absolute font-mono text-[13px] uppercase leading-7 tracking-[0.08em] text-text-muted">
              <span
                className="pointer-events-none absolute -left-8 -top-8 h-px w-40 bg-text-primary/45"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -left-8 -top-8 h-24 w-px bg-text-primary/45"
                aria-hidden="true"
              />
              <p>
                STATUS: <span className="text-accent-red-bright">OPEN</span>
              </p>
              <p>AVAILABLE FOR</p>
              <p>SELECTED PROJECTS</p>
            </div>

            <div className="hero-focus-panel absolute font-mono text-sm uppercase leading-7 tracking-[0.08em] text-text-muted">
              <span className="pointer-events-none absolute -left-8 -top-8 h-px w-10 bg-text-primary/50" />
              <span className="pointer-events-none absolute -left-8 -top-8 h-10 w-px bg-text-primary/50" />
              <span className="pointer-events-none absolute -right-8 -top-8 h-px w-10 bg-text-primary/50" />
              <span className="pointer-events-none absolute -right-8 -top-8 h-10 w-px bg-text-primary/50" />
              <span className="pointer-events-none absolute -bottom-8 -left-8 h-px w-10 bg-text-primary/50" />
              <span className="pointer-events-none absolute -bottom-8 -left-8 h-10 w-px bg-text-primary/50" />
              <span className="pointer-events-none absolute -bottom-8 -right-8 h-px w-10 bg-text-primary/50" />
              <span className="pointer-events-none absolute -bottom-8 -right-8 h-10 w-px bg-text-primary/50" />
              <p className="mb-1 text-accent-red-bright">Focus</p>
              <p>Design systems</p>
              <p>Web experiences</p>
              <p>Brand visuals</p>
            </div>

            <div className="hero-hud-marker absolute flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-4 border-2 border-accent-red-bright" />
            </div>
          </div>
        </div>

        <div className="hero-footer-grid grid gap-6 pb-6 font-mono text-xs uppercase tracking-[0.12em] text-text-muted 2xl:grid-cols-3 2xl:items-end 2xl:pb-10">
          <div className="hero-footer-coordinates hidden leading-6 2xl:block">
            <p className="text-accent-red-bright">&gt; Coordinates</p>
            <p>55.7558° N, 37.6173° E</p>
            <p className="mt-2 text-accent-red-bright">&gt; Timezone</p>
            <p>UTC +03:00</p>
          </div>

          <div className="hero-footer-rights hidden text-center 2xl:flex">
            <span className="hero-footer-rule" aria-hidden="true" />
            <span className="hero-footer-rights-text">
              © DIZFANIT · ALL RIGHTS RESERVED
            </span>
            <span className="hero-footer-rule" aria-hidden="true" />
          </div>

          <div className="hero-footer-online flex items-center justify-start gap-4 text-accent-red-bright md:justify-end">
            <span>SYSTEM ONLINE</span>
            <span className="h-2 w-2 bg-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.95)]" />
            <span className="hidden h-6 w-28 bg-[repeating-linear-gradient(90deg,rgba(230,226,218,0.45)_0_2px,transparent_2px_10px)] md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
