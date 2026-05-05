export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-site-bg text-text-primary">
      <video
        className="absolute inset-0 h-full w-full object-cover object-[90%_center] opacity-95 2xl:object-[78%_center]"
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
        className="pointer-events-none absolute inset-[36px] border border-transparent"
        aria-hidden="true"
      >
        <span className="absolute left-0 top-0 h-px w-9 bg-text-primary/45" />
        <span className="absolute left-0 top-0 h-9 w-px bg-text-primary/45" />
        <span className="absolute right-0 top-0 h-px w-9 bg-text-primary/45" />
        <span className="absolute right-0 top-0 h-9 w-px bg-text-primary/45" />
        <span className="absolute bottom-0 left-0 h-px w-9 bg-text-primary/45" />
        <span className="absolute bottom-0 left-0 h-9 w-px bg-text-primary/45" />
        <span className="absolute bottom-0 right-0 h-px w-9 bg-text-primary/45" />
        <span className="absolute bottom-0 right-0 h-9 w-px bg-text-primary/45" />
      </div>

      <div
        className="absolute left-[34px] top-[106px] hidden h-[118px] w-px bg-[repeating-linear-gradient(to_bottom,rgba(230,226,218,0.45)_0_2px,transparent_2px_8px)] xl:block"
        aria-hidden="true"
      />
      <div
        className="absolute left-[34px] top-[244px] hidden h-2 w-2 bg-accent-red-bright xl:block"
        aria-hidden="true"
      />
      <div className="absolute left-[30px] top-[286px] hidden origin-left rotate-90 font-mono text-xs uppercase tracking-[0.44em] text-accent-red-bright xl:block">
        Terminal 01
      </div>
      <div className="absolute right-[34px] top-[238px] hidden origin-right rotate-90 font-mono text-xs uppercase tracking-[0.44em] text-accent-red-bright xl:block">
        Creative · Intentional · Impactful
      </div>

      <div
        className="relative z-10 flex min-h-screen flex-col justify-between"
        style={{ paddingInline: "clamp(28px, 5.6vw, 112px)" }}
      >
        <div className="grid flex-1 items-center pt-24 lg:pt-20 2xl:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)]">
          <div
            className="translate-y-2 lg:translate-y-0 xl:translate-y-10 2xl:translate-y-0"
            style={{ maxWidth: "min(1040px, calc(100vw - 56px))" }}
          >
            <p className="mb-8 font-mono text-sm uppercase tracking-[0.16em] text-accent-red-bright md:text-base">
              &gt;_ WEB DESIGNER / VISUAL SYSTEMS
            </p>

            <h1
              className="w-[calc(100vw-56px)] font-heading font-bold leading-[0.98] tracking-[0.01em] text-text-primary drop-shadow-[0_0_18px_rgba(230,226,218,0.3)]"
              style={{
                fontSize: "clamp(44px, min(4.35vw, 6.6vh), 64px)",
                maxWidth: "min(1040px, calc(58vw - 64px))",
              }}
            >
              Делаю сайты,
              <br />
              которые выглядят
              <br />
              не&nbsp;как&nbsp;шаблон
            </h1>

            <p
              className="w-[calc(100vw-56px)] max-w-[640px] break-words font-subheading text-lg leading-8 tracking-[0.02em] text-text-muted md:max-w-[680px] md:text-[22px] md:leading-[1.45] 2xl:max-w-[900px]"
              style={{
                marginTop: "clamp(1.375rem, 2.6vh, 2.25rem)",
              }}
            >
              Проектирую визуальный образ бизнеса: сайты, презентации,
              <br />
              соцсети&nbsp;и digital-упаковку с&nbsp;акцентом
              на&nbsp;сильное первое впечатление.
            </p>

            <div
              className="flex flex-col gap-5 sm:flex-row"
              style={{ marginTop: "clamp(2.75rem, 5.2vh, 4.5rem)" }}
            >
              <a
                className="flex min-h-[66px] w-[calc(100vw-56px)] items-center justify-between border border-accent-red-bright bg-accent-red-bright/75 px-8 text-base text-white shadow-[0_0_38px_rgba(209,10,10,0.5),inset_0_0_32px_rgba(255,255,255,0.08)] sm:w-auto sm:min-w-[320px]"
                href="#work"
              >
                <span>Смотреть работы</span>
                <span className="font-mono text-2xl leading-none" aria-hidden="true">
                  -&gt;
                </span>
              </a>

              <a
                className="flex min-h-[66px] w-[calc(100vw-56px)] items-center justify-between border border-text-primary/50 bg-site-bg/25 px-8 text-base text-text-primary backdrop-blur-sm sm:w-auto sm:min-w-[280px]"
                href="#contact"
              >
                <span>Связаться</span>
                <span className="font-mono text-2xl leading-none" aria-hidden="true">
                  -&gt;
                </span>
              </a>
            </div>
          </div>

          <div className="relative hidden h-full min-h-[560px] 2xl:block">
            <div className="absolute left-[-36%] top-[18%] font-mono text-[13px] uppercase leading-7 tracking-[0.08em] text-text-muted">
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

            <div className="absolute bottom-[19%] right-[6%] font-mono text-sm uppercase leading-7 tracking-[0.08em] text-text-muted">
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

            <div className="absolute right-[-54px] top-[23%] flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-4 border-2 border-accent-red-bright" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 pb-6 font-mono text-xs uppercase tracking-[0.12em] text-text-muted 2xl:grid-cols-3 2xl:items-end 2xl:pb-10">
          <div className="hidden leading-6 2xl:block">
            <p className="text-accent-red-bright">&gt; Coordinates</p>
            <p>55.7558° N, 37.6173° E</p>
            <p className="mt-2 text-accent-red-bright">&gt; Timezone</p>
            <p>UTC +03:00</p>
          </div>

          <div className="hidden text-center 2xl:block">
            <span className="mr-6 inline-block h-px w-40 bg-text-primary/25 align-middle" />
            © DIZFANIT · ALL RIGHTS RESERVED
            <span className="ml-6 inline-block h-px w-40 bg-text-primary/25 align-middle" />
          </div>

          <div className="flex items-center justify-start gap-4 text-accent-red-bright md:justify-end">
            <span>SYSTEM ONLINE</span>
            <span className="h-2 w-2 bg-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.95)]" />
            <span className="hidden h-6 w-28 bg-[repeating-linear-gradient(90deg,rgba(230,226,218,0.45)_0_2px,transparent_2px_10px)] md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
