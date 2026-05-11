const services = [
  {
    number: "01",
    title: "WEB DESIGN",
    text: "Создаю сайты и лендинги, которые цепляют и вызывают доверие.",
  },
  {
    number: "02",
    title: "PRESENTATIONS",
    text: "Делаю презентации, которые не выглядят как шаблон.",
  },
  {
    number: "03",
    title: "SOCIAL VISUALS",
    text: "Оформляю соцсети, делаю креативы и визуальную упаковку брендов.",
  },
];

const principles = [
  {
    title: "ФОКУС",
    text: "на результате",
    iconClass: "about-principle-icon--focus",
  },
  {
    title: "ВНИМАНИЕ",
    text: "к деталям",
    iconClass: "about-principle-icon--eye",
  },
];

export default function About() {
  return (
    <section id="about" className="about-section site-shell">
      <div className="about-bg" aria-hidden="true" />

      <div className="about-frame" aria-hidden="true">
        <span className="about-frame-corner about-frame-corner--tl" />
        <span className="about-frame-corner about-frame-corner--tr" />
        <span className="about-frame-corner about-frame-corner--bl" />
        <span className="about-frame-corner about-frame-corner--br" />
      </div>

      <div className="about-shell">
        <div className="about-layout">
          <div className="about-left">
            <p className="about-section-label">// SECTION 02</p>

            <h2 className="about-title">
              <span>ABOUT</span>
              <span>
                DIZFANIT<b>_</b>
              </span>
            </h2>

            <div className="about-copy-block">
              <p className="about-kicker">&gt; WHO I AM</p>
              <p className="about-lead">
                Я дизайнер, который работает с первым впечатлением бизнеса.
              </p>
              <p className="about-copy">
                Создаю сайты, презентации и визуальную упаковку, которые выглядят
                дороже, чище и сильнее шаблонных решений.
              </p>
            </div>

            <div className="about-service-grid">
              {services.map((service) => (
                <article className="about-service-card" key={service.number}>
                  <p className="about-service-number">{service.number}</p>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="about-right">
            <div className="about-media" aria-label="DIZFANIT portrait placeholder">
              <div className="about-avatar" aria-hidden="true">
                <span className="about-avatar-head" />
                <span className="about-avatar-body" />
              </div>
            </div>

            <div className="about-approach">
              <p className="about-kicker">&gt; APPROACH</p>
              <p className="about-approach-copy">
                Для меня дизайн - это не просто картинка. Это инструмент, который
                помогает бизнесу выглядеть сильнее, вызывать доверие и увеличивать
                продажи.
              </p>

              <div className="about-principles">
                {principles.map((principle) => (
                  <div className="about-principle" key={principle.title}>
                    <span
                      className={`about-principle-icon ${principle.iconClass}`}
                      aria-hidden="true"
                    />
                    <p>
                      <strong>{principle.title}</strong>
                      <span>{principle.text}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="about-status">
          <span>STATUS:</span> OPEN FOR PROJECTS
        </p>
      </div>
    </section>
  );
}
