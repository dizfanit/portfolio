import Image from "next/image";
import ScrambleTitle from "./ScrambleTitle";

const services = [
  {
    number: "01",
    title: "ВЕБ-ДИЗАЙН",
    text: "Разрабатываю стильные и функциональные сайты с акцентом на эстетику, удобство и конверсию.",
    icon: "web",
  },
  {
    number: "02",
    title: "ПРЕЗЕНТАЦИИ",
    text: "Создаю продающие презентации, которые доносят суть и усиливают впечатление.",
    icon: "presentations",
  },
  {
    number: "03",
    title: "ЦИФРОВЫЕ ПРОДУКТЫ",
    text: "Проектирую интерфейсы и лендинги для цифровых продуктов и сервисов любой сложности.",
    icon: "products",
  },
  {
    number: "04",
    title: "ВИЗУАЛ БРЕНДА",
    text: "Создаю визуальные системы, которые делают бренд узнаваемым и запоминающимся.",
    icon: "brand",
  },
  {
    number: "05",
    title: "ДИЗАЙН УПАКОВКИ",
    text: "Разрабатываю упаковку, которая привлекает внимание и усиливает ценность продукта.",
    icon: "packaging",
  },
  {
    number: "06",
    title: "ВИЗУАЛ ДЛЯ СОЦСЕТЕЙ",
    text: "Оформляю контент для соцсетей, который цепляет и выделяет среди конкурентов.",
    icon: "social",
  },
  {
    number: "07",
    title: "РЕКЛАМНЫЕ КРЕАТИВЫ",
    text: "Создаю рекламные креативы, которые привлекают внимание и работают на результат.",
    icon: "advertising",
  },
  {
    number: "08",
    title: "САЙТЫ БЕЗ КОДА",
    text: "Собираю сайты и сервисы на платформах без кода быстро, чисто и эффективно.",
    icon: "nocode",
  },
] as const;

const labels = ["WEB DESIGN", "PRESENTATIONS", "DIGITAL PRODUCTS", "BRAND VISUAL", "PACKAGING", "SOCIAL MEDIA", "ADS CREATIVE", "NO-CODE"];

function BuildVisual({ name }: { name: (typeof services)[number]["icon"] }) {
  return (
    <div className="build-visual" aria-hidden="true">
      <Image src={`/services/${name}-generated.png`} alt="" fill
        sizes="(max-width: 767px) 90vw, (max-width: 1279px) 42vw, 21vw"
        className="build-visual-art" />
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="build-section site-shell" aria-label="Что я делаю">
      <div className="build-bg" aria-hidden="true" />
      <div className="section-guide-frame" aria-hidden="true">
        <span className="section-frame-corner section-frame-corner--tl" />
        <span className="section-frame-corner section-frame-corner--tr" />
        <span className="section-frame-corner section-frame-corner--bl" />
        <span className="section-frame-corner section-frame-corner--br" />
      </div>

      <div className="section-side-rail section-side-rail-left build-side-rail" aria-hidden="true">
        <span className="section-side-line" />
        <span className="section-side-dot" />
        <span className="section-side-label">Terminal 04</span>
      </div>
      <div className="section-side-rail section-side-rail-right build-side-rail" aria-hidden="true">
        <span className="section-side-line" />
        <span className="section-side-dot" />
        <span className="section-side-label">Signal 04</span>
      </div>

      <div className="build-shell">
        <header className="build-heading">
          <div className="build-heading-title">
            <ScrambleTitle className="build-title" russian="ЧТО Я ДЕЛАЮ" english="WHAT I BUILD" />
            <p className="build-route" aria-label="Идеи, структура, дизайн, результат">
              <span>Идеи</span><i aria-hidden="true">⟶</i><span>Структура</span><i aria-hidden="true">⟶</i><span>Дизайн</span><i aria-hidden="true">⟶</i><span>Результат</span>
            </p>
          </div>
          <div className="build-intro">
          <p className="build-copy">
            Создаю цифровые продукты, которые решают задачи бизнеса и выглядят
            сильно. От идеи и структуры до визуала, упаковки и запуска.
          </p>
          <div className="build-stamp">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 12 4 4 8-8" /></svg>
            <span>Дизайн, <em>который работает</em></span>
          </div>
          </div>
        </header>

        <div className="build-grid">
          {services.map((service, index) => (
            <article className="build-card" key={service.number}>
              <div className="build-card-meta" aria-hidden="true">
                <span className="build-card-number">/{service.number}</span>
                <span className="build-card-label"><i />{labels[index]}</span>
              </div>
              <BuildVisual name={service.icon} />
              <div className="build-card-copy">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a className="build-card-link" href="#contact" aria-label={`Обсудить: ${service.title.toLowerCase()}`}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </a>
              </div>
            </article>
          ))}
        </div>


      </div>
    </section>
  );
}
