const services = [
  {
    title: "Websites",
    text: "Дизайн сайтов, лендингов и промо-страниц.",
  },
  {
    title: "Presentations",
    text: "Презентации с сильной визуальной подачей.",
  },
  {
    title: "Social Visuals",
    text: "Оформление ВК, Telegram и рекламные креативы.",
  },
  {
    title: "Redesign",
    text: "Обновление старого визуала, чтобы он выглядел дороже и современнее.",
  },
];

export default function Services() {
  return (
    <section
      className="site-shell relative overflow-hidden bg-site-bg py-24 text-text-primary"
    >
      <div
        className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(0deg,rgba(230,226,218,0.7)_0px,rgba(230,226,218,0.7)_1px,transparent_1px,transparent_8px)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-red-bright/55 to-transparent"
        aria-hidden="true"
      />

      <div className="relative w-full">
        <div className="mb-10 border-l border-text-primary/20 pl-6 sm:mb-14 sm:pl-9">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-accent-red-bright">
            &gt; Services / Build list
          </p>

          <h2 className="font-heading text-[40px] font-bold uppercase leading-none tracking-[0.08em] text-text-primary drop-shadow-[0_0_16px_rgba(230,226,218,0.18)] sm:text-[56px] lg:text-[72px]">
            WHAT I BUILD
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <article
              className="group relative min-h-[230px] overflow-hidden border border-text-primary/15 bg-graphite/60 p-6 shadow-[inset_0_0_34px_rgba(255,255,255,0.025)] transition-colors duration-200 hover:border-accent-red-bright hover:bg-accent-red/10 sm:p-8"
              key={service.title}
            >
              <span
                className="absolute right-6 top-6 font-mono text-xs uppercase tracking-[0.18em] text-text-muted transition-colors duration-200 group-hover:text-accent-red-bright"
                aria-hidden="true"
              >
                0{index + 1}
              </span>

              <div className="mb-12 h-px w-16 bg-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.65)]" />

              <h3 className="max-w-[460px] font-heading text-[28px] font-bold uppercase leading-none tracking-[0.07em] text-text-primary transition-colors duration-200 group-hover:text-white sm:text-[36px]">
                {service.title}
              </h3>

              <p className="mt-6 max-w-[520px] font-subheading text-base leading-7 text-text-muted sm:text-lg">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
