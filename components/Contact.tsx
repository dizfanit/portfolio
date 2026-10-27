import Image from "next/image";
import ContactAtmosphere from "./ContactAtmosphere";
import titleStyles from "./ScrambleTitle.module.css";
import styles from "./Contact.module.css";

const contactLinks = [
  { label: "Telegram", handle: "@dizfanit", href: "https://t.me/dizfanit", icon: "telegram" },
  { label: "ВКонтакте", handle: "/dizfanit", href: "https://vk.ru/dizfanit", icon: "vk" },
] as const;

function ContactIcon({ kind }: { kind: "telegram" | "vk" }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      {kind === "telegram" ? (
        <path d="M27.4 4.5 23 26.7c-.3 1.6-1.2 2-2.5 1.2l-6.7-4.9-3.2 3.1c-.4.4-.7.7-1.4.7l.5-6.8L22.1 8.8c.5-.5-.1-.8-.8-.3L6.5 17.8.3 15.9c-1.4-.4-1.4-1.4.3-2L25.2 4.4c1.1-.4 2.1-.1 2.2.1Z" transform="translate(2 0)" />
      ) : (
        <path d="M3 7h5c.4 6.3 2.8 10.1 5 11.1V7h4.7v6.4c2.2-.3 4.5-3.6 5.3-6.4h4.7c-.6 3.4-3.1 6.6-5.2 8 2.1 1.1 5 4 6.3 8h-5.2c-1-2.6-3.5-5.1-5.9-5.4V23h-.6C8.2 23 3.4 17.1 3 7Z" />
      )}
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className={`site-shell ${styles.section}`}>
      <div className={styles.background} aria-hidden="true">
        <Image src="/contact-world.webp" alt="" fill sizes="100vw" unoptimized className={styles.image} />
        <ContactAtmosphere />
      </div>
      <div className={styles.texture} aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(0deg,rgba(230,226,218,0.7)_0px,rgba(230,226,218,0.7)_1px,transparent_1px,transparent_4px)]" />
        <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px)] bg-[length:6px_6px]" />
      </div>
      <div className="section-guide-frame" aria-hidden="true">
        <span className="section-frame-corner section-frame-corner--tl" />
        <span className="section-frame-corner section-frame-corner--tr" />
        <span className="section-frame-corner section-frame-corner--bl" />
        <span className="section-frame-corner section-frame-corner--br" />
      </div>
      <div className={`section-side-rail section-side-rail-left ${styles.rail}`} aria-hidden="true">
        <span className="section-side-line" /><span className="section-side-dot" />
        <span className="section-side-label">Terminal 06</span>
      </div>
      <div className={`section-side-rail section-side-rail-right ${styles.rail}`} aria-hidden="true">
        <span className="section-side-line" /><span className="section-side-dot" />
        <span className="section-side-label">Contacts 01</span>
      </div>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className="hero-eyebrow font-mono uppercase text-accent-red-bright">&gt;_ Контакты</p>
          <h2 id="contact-title" className={`hero-title font-heading ${styles.title}`}>
            <span>Давайте</span><span>обсудим</span>
            <span className={styles.titleLine}>проект<i className={titleStyles.cursor} aria-hidden="true" /></span>
          </h2>
          <p className="hero-lead text-text-muted">
            Открыт к новым проектам, интересным задачам и долгосрочному сотрудничеству. Напишите мне — обсудим вашу идею и найдём лучшее решение.
          </p>
          <div className={styles.links}>
            {contactLinks.map((link) => (
              <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer" key={link.icon}>
                <span className={styles.icon}><ContactIcon kind={link.icon} /></span>
                <span className={styles.linkText}>
                  <span className={styles.linkLabel}>{link.label}</span>
                  <span className={`font-mono text-xs ${styles.handle}`}>{link.handle}</span>
                </span>
                <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <footer className={`font-mono text-xs uppercase tracking-[0.12em] text-text-muted ${styles.footer}`}>
          <div className={`leading-6 ${styles.coordinates}`}>
            <p><span>&gt; Format</span>Удалённо / Online</p>
            <p><span>&gt; Timezone</span>UTC +02:00</p>
          </div>
          <div className={styles.systemFooter}>
            <p className="hero-footer-rights-text">© Dizfanit · All rights reserved</p>
            <div className="flex items-center gap-4 text-accent-red-bright">
              <span>System online</span>
              <span className="h-2 w-2 bg-accent-red-bright shadow-[0_0_18px_rgba(209,10,10,0.95)]" aria-hidden="true" />
              <span className="hidden h-6 w-28 bg-[repeating-linear-gradient(90deg,rgba(230,226,218,0.45)_0_2px,transparent_2px_10px)] md:block" aria-hidden="true" />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
