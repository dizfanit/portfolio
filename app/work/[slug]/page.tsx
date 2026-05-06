import Link from "next/link";
import { notFound } from "next/navigation";

import { cases } from "../../../data/cases";

type CasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const caseBlocks = [
  {
    title: "Task",
    text: "Placeholder task description. This block will define the project objective and client request.",
  },
  {
    title: "Problem",
    text: "Placeholder problem description. This block will explain the visual and business challenge.",
  },
  {
    title: "Solution",
    text: "Placeholder solution description. This block will show the direction, logic, and final approach.",
  },
  {
    title: "Visual System",
    text: "Placeholder visual system description. This block will cover typography, layout, color, and interface rules.",
  },
  {
    title: "Screens",
    text: "Placeholder screens area. Images and interface previews will be added here later.",
  },
  {
    title: "Result",
    text: "Placeholder result description. This block will summarize the outcome and project value.",
  },
];

export function generateStaticParams() {
  return cases.map((caseItem) => ({
    slug: caseItem.slug,
  }));
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseItem = cases.find((item) => item.slug === slug);

  if (!caseItem) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-site-bg px-7 py-10 text-text-primary sm:px-10 lg:px-16 xl:px-28">
      <section className="relative mx-auto max-w-[1180px] overflow-hidden border border-text-primary/15 bg-graphite/45 px-6 py-8 shadow-[inset_0_0_42px_rgba(255,255,255,0.025)] sm:px-9 sm:py-11 lg:px-12">
        <div
          className="absolute inset-0 opacity-[0.045] bg-[repeating-linear-gradient(0deg,rgba(230,226,218,0.7)_0px,rgba(230,226,218,0.7)_1px,transparent_1px,transparent_7px)]"
          aria-hidden="true"
        />

        <div className="relative">
          <Link
            className="mb-12 inline-flex min-h-11 items-center gap-4 border border-text-primary/20 px-5 font-mono text-xs uppercase tracking-[0.16em] text-text-muted transition-colors duration-200 hover:border-accent-red-bright hover:text-accent-red-bright"
            href="/"
          >
            <span aria-hidden="true">&lt;-</span>
            Back to main
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
            <div className="border-l border-text-primary/20 pl-6 sm:pl-9">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-accent-red-bright">
                &gt; Case file / {caseItem.slug}
              </p>

              <h1 className="font-heading text-[44px] font-bold uppercase leading-none tracking-[0.08em] text-text-primary drop-shadow-[0_0_18px_rgba(230,226,218,0.2)] sm:text-[64px] lg:text-[84px]">
                {caseItem.title}
              </h1>

              <p className="mt-8 max-w-[760px] font-subheading text-lg leading-8 text-text-muted sm:text-[22px] sm:leading-[1.65]">
                {caseItem.description}
              </p>
            </div>

            <div className="grid gap-3 font-mono text-xs uppercase tracking-[0.16em]">
              <div className="flex min-h-14 items-center justify-between border border-text-primary/15 bg-site-bg/55 px-5">
                <span className="text-text-muted">Type</span>
                <span>{caseItem.type}</span>
              </div>
              <div className="flex min-h-14 items-center justify-between border border-text-primary/15 bg-site-bg/55 px-5">
                <span className="text-text-muted">Year</span>
                <span>{caseItem.year}</span>
              </div>
              <div className="flex min-h-14 items-center justify-between border border-text-primary/15 bg-site-bg/55 px-5">
                <span className="text-text-muted">Niche</span>
                <span>{caseItem.industry}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-4 py-8 md:grid-cols-2">
        {caseBlocks.map((block) => (
          <article
            className="min-h-[240px] border border-text-primary/15 bg-graphite/55 p-6 shadow-[inset_0_0_32px_rgba(255,255,255,0.025)] sm:p-8"
            key={block.title}
          >
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-accent-red-bright">
              {block.title}
            </p>

            {block.title === "Screens" ? (
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <span className="h-28 border border-text-primary/10 bg-site-bg/65" />
                <span className="h-28 border border-text-primary/10 bg-site-bg/65" />
                <span className="h-28 border border-text-primary/10 bg-site-bg/65" />
              </div>
            ) : null}

            <p className="font-subheading text-base leading-7 text-text-muted sm:text-lg">
              {block.text}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
