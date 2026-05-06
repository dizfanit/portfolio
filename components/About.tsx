const aboutItems = ["Web design", "Presentations", "Social visuals"];

export default function About() {
  return (
    <section
      id="about"
      className="site-shell relative scroll-mt-24 overflow-hidden bg-site-bg py-24 text-text-primary"
    >
      <div
        className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(0deg,rgba(230,226,218,0.65)_0px,rgba(230,226,218,0.65)_1px,transparent_1px,transparent_6px)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-text-primary/35 to-transparent"
        aria-hidden="true"
      />

      <div className="relative grid w-full gap-14 lg:grid-cols-[0.76fr_0.24fr] lg:items-end">
        <div className="relative border-l border-text-primary/20 pl-6 sm:pl-9">
          <span
            className="absolute left-[-1px] top-0 h-16 w-px bg-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.8)]"
            aria-hidden="true"
          />

          <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-accent-red-bright">
            &gt; Profile / 02
          </p>

          <h2 className="font-heading text-[40px] font-bold uppercase leading-none tracking-[0.08em] text-text-primary drop-shadow-[0_0_16px_rgba(230,226,218,0.22)] sm:text-[56px] lg:text-[72px]">
            ABOUT DIZFANIT
          </h2>

          <p className="mt-8 max-w-[760px] font-subheading text-[18px] leading-[1.75] text-text-muted sm:text-[22px] sm:leading-[1.65]">
            Я дизайнер, который работает с первым впечатлением бизнеса. Делаю
            сайты, презентации и визуальную упаковку, которые выглядят дороже,
            чище и сильнее шаблонных решений.
          </p>
        </div>

        <div className="grid gap-3 font-mono text-xs uppercase tracking-[0.16em] text-text-primary sm:grid-cols-3 lg:grid-cols-1">
          {aboutItems.map((item, index) => (
            <div
              className="flex min-h-16 items-center justify-between border border-text-primary/15 bg-graphite/70 px-5 shadow-[inset_0_0_28px_rgba(255,255,255,0.025)]"
              key={item}
            >
              <span className="text-text-muted">0{index + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
