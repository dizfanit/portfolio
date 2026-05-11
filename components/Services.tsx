const services = [
  {
    number: "01",
    title: "WEB DESIGN",
    text: "Разрабатываю стильные и функциональные сайты с акцентом на эстетику, удобство и конверсию.",
    icon: "web",
  },
  {
    number: "02",
    title: "PRESENTATIONS",
    text: "Создаю продающие презентации, которые доносят суть и усиливают впечатление.",
    icon: "presentations",
  },
  {
    number: "03",
    title: "DIGITAL PRODUCTS",
    text: "Проектирую интерфейсы и лендинги для цифровых продуктов и сервисов любой сложности.",
    icon: "products",
  },
  {
    number: "04",
    title: "BRAND VISUALS",
    text: "Создаю визуальные системы, которые делают бренд узнаваемым и запоминающимся.",
    icon: "brand",
  },
  {
    number: "05",
    title: "PACKAGING",
    text: "Разрабатываю упаковку, которая привлекает внимание и усиливает ценность продукта.",
    icon: "packaging",
  },
  {
    number: "06",
    title: "SOCIAL VISUALS",
    text: "Оформляю контент для соцсетей, который цепляет и выделяет среди конкурентов.",
    icon: "social",
  },
  {
    number: "07",
    title: "ADVERTISING",
    text: "Создаю рекламные креативы, которые привлекают внимание и работают на результат.",
    icon: "advertising",
  },
  {
    number: "08",
    title: "NO-CODE SOLUTIONS",
    text: "Собираю сайты и сервисы на no-code платформах быстро, чисто и эффективно.",
    icon: "nocode",
  },
] as const;

type ServiceIcon = (typeof services)[number]["icon"];

function BuildIcon({ name }: { name: ServiceIcon }) {
  if (name === "web") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="10" y="10" width="52" height="52" />
        <path d="M10 10L62 62M62 10L10 62" />
      </svg>
    );
  }

  if (name === "presentations") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="10" y="16" width="52" height="34" rx="1" />
        <path d="M21 39L28 25L36 39Z" />
        <path d="M42 31H54M42 36H54" />
        <path d="M36 50V57M22 62L36 55L50 62" />
      </svg>
    );
  }

  if (name === "products") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="24" y="8" width="28" height="56" rx="4" />
        <path d="M33 14H43M32 54H44M35 58H41" />
      </svg>
    );
  }

  if (name === "brand") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <path d="M14 28H60V62H14Z" />
        <path d="M26 28V20C26 12.8 30.3 8 36 8C41.7 8 46 12.8 46 20V28" />
      </svg>
    );
  }

  if (name === "packaging") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <path d="M36 8L60 21V51L36 64L12 51V21L36 8Z" />
        <path d="M12 21L36 34L60 21M36 34V64" />
      </svg>
    );
  }

  if (name === "social") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r="28" />
        <circle cx="36" cy="29" r="7" />
        <path d="M22 52C24.6 43.5 29.7 39 36 39C42.3 39 47.4 43.5 50 52Z" />
      </svg>
    );
  }

  if (name === "advertising") {
    return (
      <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <path d="M18 31H28L58 16V56L28 43H18Z" />
        <path d="M18 31V43M30 43V60H23V43" />
      </svg>
    );
  }

  return (
    <svg className="build-card-icon" viewBox="0 0 72 72" aria-hidden="true">
      <rect x="13" y="10" width="46" height="52" rx="3" />
      <path d="M29 28L20 36L29 44M43 28L52 36L43 44M39 24L33 48" />
    </svg>
  );
}

export default function Services() {
  return (
    <section id="services" className="build-section site-shell">
      <div className="build-bg" aria-hidden="true" />

      <div
        className="build-guide-frame pointer-events-none absolute border border-transparent"
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
        className="build-side-line absolute hidden w-px bg-[repeating-linear-gradient(to_bottom,rgba(230,226,218,0.45)_0_2px,transparent_2px_8px)] xl:block"
        aria-hidden="true"
      />
      <div
        className="build-side-dot absolute hidden h-2 w-2 bg-accent-red-bright xl:block"
        aria-hidden="true"
      />
      <div className="build-side-label-left absolute hidden origin-left rotate-90 font-mono text-xs uppercase tracking-[0.44em] text-accent-red-bright xl:block">
        Terminal 04
      </div>
      <div className="build-side-label-right absolute hidden origin-right rotate-90 font-mono text-xs uppercase tracking-[0.44em] text-accent-red-bright xl:block">
        Services - Systems - Launch
      </div>

      <div className="build-shell">
        <div className="build-topline">
          <span>// Section 04 -</span>
          <span>
            Build_List <b>-</b>
          </span>
        </div>

        <div className="build-layout">
          <div className="build-heading">
            <p className="build-eyebrow">&gt;_ Services / Build list</p>
            <h2 className="build-title">
              <span>WHAT I</span>
              <span>
                BUILD<b aria-hidden="true">_</b>
              </span>
            </h2>
            <p className="build-copy">
              Создаю цифровые продукты, которые решают задачи бизнеса и выглядят
              сильно. От идеи и структуры до визуала, упаковки и запуска.
            </p>
          </div>

          <div className="build-status">
            <p>
              STATUS: <span>OPEN</span>
            </p>
            <p>AVAILABLE FOR</p>
            <p>SELECTED PROJECTS</p>
          </div>

          <div className="build-grid">
            {services.map((service) => (
              <article className="build-card" key={service.number}>
                <p className="build-card-number">{service.number}</p>
                <BuildIcon name={service.icon} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="build-footer">
          <p>
            Scope: <span>Design - Web - Brand</span> <b />
          </p>
          <p>
            Direction <span>///</span>
          </p>
        </div>
      </div>
    </section>
  );
}
