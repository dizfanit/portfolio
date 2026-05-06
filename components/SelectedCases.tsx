import Link from "next/link";

import { cases } from "../data/cases";

export default function SelectedCases() {
  return (
    <section
      id="work"
      className="site-shell relative scroll-mt-24 overflow-hidden bg-site-bg py-24 text-text-primary"
    >
      <div
        className="absolute inset-0 opacity-[0.045] bg-[repeating-linear-gradient(90deg,rgba(230,226,218,0.72)_0px,rgba(230,226,218,0.72)_1px,transparent_1px,transparent_7px)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-text-primary/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative w-full">
        <div className="mb-10 flex flex-col gap-5 border-l border-text-primary/20 pl-6 sm:mb-14 sm:pl-9 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-accent-red-bright">
              &gt; Archive / Selected
            </p>
            <h2 className="font-heading text-[40px] font-bold uppercase leading-none tracking-[0.08em] text-text-primary drop-shadow-[0_0_16px_rgba(230,226,218,0.18)] sm:text-[56px] lg:text-[72px]">
              Selected Cases
            </h2>
          </div>

          <p className="max-w-[360px] font-mono text-xs uppercase leading-6 tracking-[0.14em] text-text-muted">
            Indexed work files / Web, decks, visual systems.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cases.map((caseItem, index) => (
            <Link
              className="group flex min-h-[300px] flex-col justify-between border border-text-primary/15 bg-graphite/60 p-6 shadow-[inset_0_0_32px_rgba(255,255,255,0.025)] transition-colors duration-200 hover:border-accent-red-bright hover:bg-accent-red/10 sm:p-8"
              href={`/work/${caseItem.slug}`}
              key={caseItem.slug}
              aria-label={`Open ${caseItem.title}`}
            >
              <div>
                <div className="mb-8 flex items-center justify-between gap-5 font-mono text-xs uppercase tracking-[0.16em]">
                  <span className="text-accent-red-bright">
                    CASE {String(index + 1).padStart(3, "0")}
                  </span>
                  <span className="text-text-muted">{caseItem.year}</span>
                </div>

                <h3 className="font-heading text-[30px] font-bold uppercase leading-[1.05] tracking-[0.06em] text-text-primary transition-colors duration-200 group-hover:text-white sm:text-[38px]">
                  {caseItem.title}
                </h3>

                <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-text-muted transition-colors duration-200 group-hover:text-accent-red-bright">
                  {caseItem.type}
                </p>

                <p className="mt-7 max-w-[520px] font-subheading text-base leading-7 text-text-muted sm:text-lg">
                  {caseItem.description}
                </p>
              </div>

              <span className="mt-10 flex min-h-12 items-center justify-between border border-text-primary/20 px-5 font-mono text-xs uppercase tracking-[0.16em] text-text-primary transition-colors duration-200 group-hover:border-accent-red-bright group-hover:text-accent-red-bright">
                Open case
                <span className="text-lg leading-none" aria-hidden="true">
                  -&gt;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
