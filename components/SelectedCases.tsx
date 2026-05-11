import Link from "next/link";

import { cases } from "../data/cases";

const workCases = [
  {
    slug: cases[0]?.slug ?? "project-01",
    number: "001",
    title: "Nexora",
    type: "Website / Brand system",
    description:
      "Сайт для финтех-платформы с акцентом на доверие, скорость и технологичность.",
    visual: "nexora",
  },
  {
    slug: cases[1]?.slug ?? "project-02",
    number: "002",
    title: "Astra Labs",
    type: "Presentation",
    description: "Презентация для AI-стартапа о продукте и инвестициях.",
    visual: "astra",
  },
  {
    slug: cases[2]?.slug ?? "project-03",
    number: "003",
    title: "Void Club",
    type: "Social visuals",
    description:
      "Визуальная система и контент для ночного клуба и мероприятий.",
    visual: "void",
  },
  {
    slug: cases[3]?.slug ?? "project-04",
    number: "004",
    title: "Graphite",
    type: "Brand identity",
    description:
      "Айдентика и упаковка бренда премиальных аксессуаров.",
    visual: "graphite",
  },
] as const;

const featuredStats = [
  { value: "12M+", label: "Transactions" },
  { value: "98.6%", label: "Uptime" },
  { value: "150+", label: "Countries" },
];

function WorkVisual({
  featured = false,
  variant,
}: {
  featured?: boolean;
  variant: (typeof workCases)[number]["visual"];
}) {
  return (
    <div
      className={[
        "work-visual",
        `work-visual--${variant}`,
        featured ? "work-visual--featured" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {featured ? (
        <div className="work-browser">
          <div className="work-browser-top">
            <span>Nexora</span>
            <p>Solutions Platform About Contact</p>
            <b>Get started</b>
          </div>
          <div className="work-browser-stage">
            <p>
              Finance
              <br />
              without
              <br />
              borders
            </p>
            <span className="work-globe" aria-hidden="true" />
          </div>
          <div className="work-stats">
            {featuredStats.map((stat) => (
              <div className="work-stat" key={stat.label}>
                <span className="work-stat-value">{stat.value}</span>
                <span className="work-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <WorkMiniVisual variant={variant} />
      )}
    </div>
  );
}

function WorkMiniVisual({
  variant,
}: {
  variant: (typeof workCases)[number]["visual"];
}) {
  if (variant === "astra") {
    return (
      <div className="work-mini work-mini--astra">
        <div className="work-mini-window">
          <span>Astra Labs</span>
          <p>
            AI that
            <br />
            understands
            <br />
            the future
          </p>
          <b />
        </div>
        <div className="work-mini-panel" />
      </div>
    );
  }

  if (variant === "void") {
    return (
      <div className="work-mini work-mini--void">
        <span>Noid</span>
        <span>Noise echoes</span>
        <span>Void club</span>
        <span>03:17</span>
      </div>
    );
  }

  return (
    <div className="work-mini work-mini--graphite">
      <span />
      <span />
      <span />
    </div>
  );
}

function WorkExternal() {
  return (
    <span className="work-external" aria-hidden="true" />
  );
}

export default function SelectedCases() {
  const [featuredCase, ...secondaryCases] = workCases;

  return (
    <section id="work" className="work-section site-shell">
      <div className="work-bg" aria-hidden="true" />

      <div className="work-frame" aria-hidden="true">
        <span className="work-frame-corner work-frame-corner--tl" />
        <span className="work-frame-corner work-frame-corner--tr" />
        <span className="work-frame-corner work-frame-corner--bl" />
        <span className="work-frame-corner work-frame-corner--br" />
      </div>

      <div className="work-left-rail" aria-hidden="true">
        <span className="work-rail-dashes" />
        <span className="work-rail-dot" />
        <span className="work-rail-label">Terminal 03</span>
      </div>

      <div className="work-right-rail" aria-hidden="true">
        <span className="work-right-plus">+</span>
        <span className="work-right-label">Creative - Intentional - Impactful</span>
        <span className="work-right-index">
          <span />
          03
          <span />
        </span>
      </div>

      <div className="work-shell">
        <div className="work-topline">
          <span>// Section 03 -</span>
          <span>Archive_2024 <b>-</b></span>
        </div>

        <div className="work-grid">
          <div className="work-intro">
            <div>
              <h2 className="work-title">
                Work<span>_</span>
              </h2>
              <p className="work-kicker">Selected cases</p>
              <p className="work-copy">
                Подборка проектов, в которых дизайн становится инструментом
                роста: от сайтов и презентаций до визуальных систем и упаковки
                брендов.
              </p>
            </div>

            <div className="work-status">
              <p>
                Status: <span>Open</span>
              </p>
              <p>Available for</p>
              <p>Selected projects</p>
            </div>

            <Link className="work-archive-link" href="#contact">
              <span>[</span>
              View archive
              <b>-&gt;</b>
              <span>]</span>
            </Link>
          </div>

          <Link
            className="work-card work-card--featured"
            href={`/work/${featuredCase.slug}`}
            aria-label={`Open ${featuredCase.title}`}
          >
            <span className="work-card-plus" aria-hidden="true">
              +
            </span>

            <div className="work-card-copy">
              <p className="work-case-number">Case {featuredCase.number}</p>
              <h3>{featuredCase.title}</h3>
              <p className="work-case-type">{featuredCase.type}</p>
              <p className="work-case-description">{featuredCase.description}</p>
              <span className="work-view-case">
                View case <b>-&gt;</b>
              </span>
            </div>

            <WorkVisual featured variant={featuredCase.visual} />
            <WorkExternal />
          </Link>

          {secondaryCases.map((caseItem) => (
            <Link
              className="work-card work-card--small"
              href={`/work/${caseItem.slug}`}
              key={caseItem.slug}
              aria-label={`Open ${caseItem.title}`}
            >
              <span className="work-card-plus" aria-hidden="true">
                +
              </span>

              <div className="work-card-copy">
                <p className="work-case-number">Case {caseItem.number}</p>
                <h3>{caseItem.title}</h3>
                <p className="work-case-type">{caseItem.type}</p>
                <p className="work-case-description">{caseItem.description}</p>
                <span className="work-view-case">
                  View case <b>-&gt;</b>
                </span>
              </div>

              <WorkVisual variant={caseItem.visual} />
              <WorkExternal />
            </Link>
          ))}
        </div>

        <div className="work-footer">
          <p>
            Status: <span>Open for projects</span> <b />
          </p>
          <p>
            Scroll for more <span>///</span>
          </p>
        </div>
      </div>
    </section>
  );
}
