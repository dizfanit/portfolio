const processSteps = [
  {
    title: "Brief",
    text: "Фиксируем цель, аудиторию, задачи бизнеса и то, какое впечатление должен создать проект.",
  },
  {
    title: "Direction",
    text: "Собираю визуальное направление: референсы, настроение, структуру и ключевые акценты.",
  },
  {
    title: "Design",
    text: "Прорабатываю экраны, композицию, типографику и визуальную систему без лишнего шума.",
  },
  {
    title: "Build",
    text: "Перевожу дизайн в аккуратную digital-сборку или готовлю материалы к передаче в разработку.",
  },
  {
    title: "Final",
    text: "Финализирую детали, проверяю целостность подачи и отдаю готовый результат.",
  },
];

export default function Process() {
  return (
    <section
      className="relative overflow-hidden bg-site-bg py-24 text-text-primary"
      style={{ paddingInline: "clamp(28px, 5.6vw, 112px)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.045] bg-[repeating-linear-gradient(90deg,rgba(230,226,218,0.7)_0px,rgba(230,226,218,0.7)_1px,transparent_1px,transparent_8px)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-text-primary/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative w-full">
        <div className="mb-12 border-l border-text-primary/20 pl-6 sm:mb-16 sm:pl-9">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-accent-red-bright">
            &gt; Workflow / Timeline
          </p>

          <h2 className="font-heading text-[40px] font-bold uppercase leading-none tracking-[0.08em] text-text-primary drop-shadow-[0_0_16px_rgba(230,226,218,0.18)] sm:text-[56px] lg:text-[72px]">
            PROCESS
          </h2>
        </div>

        <div className="relative">
          <div
            className="absolute bottom-0 left-[15px] top-0 w-px bg-text-primary/15 sm:left-[23px]"
            aria-hidden="true"
          />

          <div className="grid gap-4">
            {processSteps.map((step, index) => (
              <article
                className="group relative grid gap-5 pl-12 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-8 sm:pl-20"
                key={step.title}
              >
                <span
                  className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center border border-accent-red-bright bg-site-bg font-mono text-[10px] uppercase tracking-[0.12em] text-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.42)] sm:h-12 sm:w-12 sm:text-xs"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>

                <div className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted sm:pt-5">
                  Step {String(index + 1).padStart(2, "0")}
                </div>

                <div className="border border-text-primary/15 bg-graphite/55 p-6 shadow-[inset_0_0_32px_rgba(255,255,255,0.025)] transition-colors duration-200 group-hover:border-accent-red-bright group-hover:bg-accent-red/10 sm:p-8">
                  <h3 className="font-heading text-[26px] font-bold uppercase leading-none tracking-[0.07em] text-text-primary transition-colors duration-200 group-hover:text-white sm:text-[34px]">
                    {step.title}
                  </h3>

                  <p className="mt-5 max-w-[760px] font-subheading text-base leading-7 text-text-muted sm:text-lg">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
