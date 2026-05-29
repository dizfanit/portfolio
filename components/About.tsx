import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="about-section site-shell">
      <div className="about-bg" aria-hidden="true" />

      <div className="section-guide-frame about-frame" aria-hidden="true">
        <span className="section-frame-corner section-frame-corner--tl" />
        <span className="section-frame-corner section-frame-corner--tr" />
        <span className="section-frame-corner section-frame-corner--bl" />
        <span className="section-frame-corner section-frame-corner--br" />
      </div>

      <div
        className="section-side-rail section-side-rail-left about-side-rail"
        aria-hidden="true"
      >
        <span className="section-side-line" />
        <span className="section-side-dot" />
        <span className="section-side-label">Profile 02</span>
      </div>
      <div
        className="section-side-rail section-side-rail-right about-side-rail"
        aria-hidden="true"
      >
        <span className="section-side-line" />
        <span className="section-side-dot" />
        <span className="section-side-label">Signal 02</span>
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
          </div>

          <div className="about-right">
            <div className="about-media" aria-label="DIZFANIT portrait">
              <Image
                className="about-portrait"
                src="/magnific__-2-zoom-__26478.png"
                alt="DIZFANIT portrait"
                fill
                sizes="(max-width: 1279px) 100vw, 50vw"
              />
              <div className="about-media-corners" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <p className="about-media-caption" aria-hidden="true">
                ID: DIZFANIT / DESIGN PROFILE
              </p>
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
