import WorkBoard from "./WorkBoard";
import ScrambleTitle from "./ScrambleTitle";

import type { PublicCase } from "../data/adminTypes";

export default function SelectedCases({ extraCases }: {extraCases?:PublicCase[]}) {
  return (
    <section id="work" className="work-section site-shell">
      <div className="work-bg" aria-hidden="true" />

      <div className="section-guide-frame work-frame" aria-hidden="true">
        <span className="section-frame-corner section-frame-corner--tl" />
        <span className="section-frame-corner section-frame-corner--tr" />
        <span className="section-frame-corner section-frame-corner--bl" />
        <span className="section-frame-corner section-frame-corner--br" />
      </div>

      <div
        className="section-side-rail section-side-rail-left work-side-rail"
        aria-hidden="true"
      >
        <span className="section-side-line" />
        <span className="section-side-dot" />
        <span className="section-side-label">Terminal 03</span>
      </div>
      <div
        className="section-side-rail section-side-rail-right work-side-rail"
        aria-hidden="true"
      >
        <span className="section-side-line" />
        <span className="section-side-dot" />
        <span className="section-side-label">Signal 03</span>
      </div>

      <div className="work-shell">
        <WorkBoard extraCases={extraCases} />

        <div className="work-copy-overlay">
          <div className="work-layout">
            <div className="work-left">
              <ScrambleTitle className="work-title" russian="РАБОТЫ" english="WORKS" />

              <div className="work-copy-block">
                <p className="work-kicker">&gt; SELECTED WORK</p>
                <p className="work-lead">
                  Проекты, в которых дизайн становится рабочим инструментом
                  бизнеса.
                </p>
                <p className="work-copy">
                  Сайты, презентации и визуальные системы, созданные для ясной
                  коммуникации, сильного первого впечатления и&nbsp;роста бренда.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
