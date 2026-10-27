"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";

import LiquidReveal from "./LiquidReveal";
import ScrambleTitle from "./ScrambleTitle";

const totalExperienceYears = 4.5;
const skillSegments = Array.from({ length: 10 }, (_, index) => index);
const experienceCounterValues = ["1", "2", "3", "4", "4.5"] as const;

const experienceCounterContainerVariants = {
  hidden: {},
  visible: {},
} satisfies Variants;

const experienceCounterVariants = {
  hidden: { y: "0%" },
  visible: {
    y: ["0%", "-20%", "-40%", "-60%", "-80%"],
    transition: {
      delay: 0.2,
      duration: 2.7,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.22, 0.44, 0.66, 1],
    },
  },
} satisfies Variants;

const experienceListVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.24,
      staggerChildren: 0.28,
    },
  },
} satisfies Variants;

const experienceItemVariants = {
  hidden: {},
  visible: {},
} satisfies Variants;

const progressFillVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.56,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} satisfies Variants;

const skillsVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.56,
      staggerChildren: 0.32,
    },
  },
} satisfies Variants;

const skillRowVariants = {
  hidden: {},
  visible: {},
} satisfies Variants;

const skillMeterVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
} satisfies Variants;

const skillSegmentVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.48,
      ease: "easeOut",
    },
  },
} satisfies Variants;

const profileStats = [
  { label: "Имя", value: "Дмитрий", icon: "name" },
  { label: "Возраст", value: "26 лет", icon: "age" },
] as const;

const experienceStats = [
  { label: "Фриланс", period: "4.5 года", years: 4.5 },
  { label: "Digital-агентство Profit Team", period: "10 месяцев", years: 10 / 12 },
  { label: "Русская Европа", period: "1 год", years: 1 },
  { label: "Атланта Строй", period: "1.3 года", years: 1.3 },
] as const;

const skillGroups = [
  {
    title: "Программы",
    items: [
      { name: "Figma", score: 10, icon: "/about-icons/figma.svg" },
      { name: "Adobe Photoshop", score: 7, icon: "/about-icons/photoshop.svg" },
      { name: "Adobe Illustrator", score: 5, icon: "/about-icons/illustrator.svg" },
      { name: "Tilda", score: 6, icon: "/about-icons/tilda.svg" },
    ],
  },
  {
    title: "Нейросети",
    items: [
      { name: "ChatGPT", score: 8, icon: "/about-icons/chatgpt.svg" },
      { name: "Codex", score: 8, icon: "/about-icons/codex.svg" },
      { name: "Claude Code", score: 4, icon: "/about-icons/claude-code.svg" },
    ],
  },
] as const;

function ProfileIcon({ name }: { name: (typeof profileStats)[number]["icon"] }) {
  if (name === "age") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <path d="M3 10h18" />
        <path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 20a6 6 0 0 0-12 0" />
      <circle cx="12" cy="10" r="4" />
      <path d="M12 2v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function getExperienceWidth(years: number) {
  const progress = Math.min(100, Math.max(0, (years / totalExperienceYears) * 100));

  return `${progress}%`;
}

export default function About() {
  const shouldReduceMotion = useReducedMotion();
  const initialAnimationState = shouldReduceMotion ? false : "hidden";

  return (
    <section id="about" className="about-section site-shell">
      <LiquidReveal
        className="about-bg about-liquid-bg"
        baseSrc="/about1.png"
        revealSrc="/about2.png"
        alt=""
        style={{ position: "absolute", inset: 0 }}
      />

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
            <ScrambleTitle className="about-title" russian="ОБО МНЕ" english="ABOUT ME" />

            <div className="about-copy-block">
              <p className="about-kicker">&gt; КТО Я</p>
              <p className="about-lead">
                Я дизайнер, который работает с&nbsp;первым впечатлением бизнеса.
              </p>
              <p className="about-copy">
                Создаю сайты, презентации и&nbsp;визуальную упаковку,
                <br />
                которые выглядят
                дороже, чище и&nbsp;сильнее шаблонных решений.
              </p>
            </div>
          </div>

          <div className="about-infographic" aria-label="Инфографика обо мне">
            <article className="about-info-panel about-info-panel--profile">
              <header className="about-panel-heading">
                <span>01</span>
                <h3>Основная информация</h3>
              </header>

              <div className="about-profile-list">
                {profileStats.map((item) => (
                  <div className="about-profile-row" key={item.label}>
                    <span
                      className={`about-profile-icon about-profile-icon--${item.icon}`}
                      aria-hidden="true"
                    >
                      <ProfileIcon name={item.icon} />
                    </span>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="about-info-panel about-info-panel--experience">
              <header className="about-panel-heading">
                <span>02</span>
                <h3>Опыт</h3>
              </header>

              <div className="about-experience-total">
                <span>Фактический опыт в&nbsp;дизайне</span>
                <motion.strong
                  className="about-experience-counter"
                  aria-label="4.5 лет"
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  variants={experienceCounterContainerVariants}
                  viewport={{ amount: 0.8, once: true }}
                  whileInView="visible"
                >
                  <span className="about-experience-reel" aria-hidden="true">
                    <motion.span
                      className="about-experience-reel-track"
                      variants={experienceCounterVariants}
                    >
                      {experienceCounterValues.map((value) => (
                        <span className="about-experience-reel-value" key={value}>
                          {value}
                        </span>
                      ))}
                    </motion.span>
                  </span>
                  <span aria-hidden="true">лет</span>
                </motion.strong>
              </div>

              <motion.div
                className="about-experience-list"
                initial={initialAnimationState}
                variants={experienceListVariants}
                viewport={{ amount: 0.3, once: true }}
                whileInView="visible"
              >
                {experienceStats.map((item) => (
                  <motion.div
                    className="about-experience-item"
                    key={item.label}
                    variants={experienceItemVariants}
                  >
                    <div className="about-experience-head">
                      <span>{item.label}</span>
                      <strong>{item.period}</strong>
                    </div>
                    <div className="about-progress-track" aria-hidden="true">
                      <motion.span
                        style={{ width: getExperienceWidth(item.years) }}
                        variants={progressFillVariants}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </article>

            <motion.article
              className="about-info-panel about-info-panel--skills"
              initial={initialAnimationState}
              variants={skillsVariants}
              viewport={{ amount: 0.18, once: true }}
              whileInView="visible"
            >
              <header className="about-panel-heading">
                <span>03</span>
                <h3>Навыки</h3>
              </header>

              {skillGroups.map((group) => (
                <div className="about-skill-group" key={group.title}>
                  <p className="about-skill-group-title">{group.title}</p>
                  <div className="about-skill-list">
                    {group.items.map((item) => (
                      <motion.div
                        className="about-skill-row"
                        key={item.name}
                        variants={skillRowVariants}
                      >
                        <span className="about-skill-icon" aria-hidden="true">
                          <Image
                            src={item.icon}
                            alt=""
                            width={30}
                            height={30}
                            unoptimized
                          />
                        </span>
                        <span className="about-skill-name">{item.name}</span>
                        <strong className="about-skill-score">{item.score}/10</strong>
                        <motion.span
                          className="about-skill-meter"
                          aria-hidden="true"
                          variants={skillMeterVariants}
                        >
                          {skillSegments.map((segment) => (
                            segment < item.score ? (
                              <motion.span
                                className="is-active"
                                key={segment}
                                variants={skillSegmentVariants}
                              />
                            ) : (
                              <span key={segment} />
                            )
                          ))}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.article>
          </div>
        </div>

        <p className="about-status">
          <span>STATUS:</span> ОТКРЫТ ДЛЯ ПРОЕКТОВ
        </p>
      </div>
    </section>
  );
}
