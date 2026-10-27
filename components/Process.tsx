import Image from "next/image";
import styles from "./Process.module.css";

const processSteps = [
  { title: "Задача", image: "task", text: "Фиксируем цель, аудиторию, задачи бизнеса и то, какое впечатление должен создать проект." },
  { title: "Направление", image: "direction", text: "Собираю визуальное направление: примеры, настроение, структуру и ключевые акценты." },
  { title: "Дизайн", image: "design", text: "Прорабатываю экраны, композицию, типографику и визуальную систему без лишнего шума." },
  { title: "Разработка", image: "development", text: "Воплощаю дизайн в готовом сайте или подготавливаю материалы для передачи в разработку." },
  { title: "Результат", image: "result", text: "Дорабатываю детали, проверяю целостность подачи и передаю готовый результат." },
];

export default function Process() {
  return (
    <section id="process" className={`site-shell ${styles.section}`} aria-labelledby="process-title">
      <div className="section-guide-frame" aria-hidden="true">
        <span className="section-frame-corner section-frame-corner--tl" />
        <span className="section-frame-corner section-frame-corner--tr" />
        <span className="section-frame-corner section-frame-corner--bl" />
        <span className="section-frame-corner section-frame-corner--br" />
      </div>
      <div className={`section-side-rail section-side-rail-left ${styles.sideRail}`} aria-hidden="true">
        <span className="section-side-line" /><span className="section-side-dot" />
        <span className="section-side-label">Терминал 05</span>
      </div>
      <div className={`section-side-rail section-side-rail-right ${styles.sideRail}`} aria-hidden="true">
        <span className="section-side-line" /><span className="section-side-dot" />
        <span className="section-side-label">Сигнал 05</span>
      </div>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div className={styles.headingMain}>
            <p className={styles.eyebrow}>&gt; Этапы работы / От идеи к результату</p>
            <h2 id="process-title" className={styles.title}>Процесс</h2>
          </div>
          <div className={styles.route} aria-hidden="true">
            <span className={styles.crosshair} />
            <p><b>[</b> Идея <b>→</b> Дизайн <b>→</b> Результат <b>]</b></p>
          </div>
        </div>
        <ol className={styles.timeline}>
          {processSteps.map((step, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <li className={styles.step} key={step.title}>
                <span className={styles.number} aria-hidden="true">{number}</span>
                <article className={styles.card}>
                  <div className={styles.copy}>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <div className={styles.visual} aria-hidden="true">
                    <Image src={`/process/${step.image}.webp`} alt="" fill sizes="(max-width: 767px) 40vw, 28vw" />
                  </div>
                  <div className={styles.telemetry} aria-hidden="true">
                    <span>[ {number} · {step.title} ]</span><i />
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
