const contactLinks = [
  {
    label: "Telegram",
    href: "https://t.me/placeholder",
  },
  {
    label: "VK",
    href: "https://vk.com/placeholder",
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen scroll-mt-24 items-center overflow-hidden bg-site-bg py-24 text-text-primary"
      style={{ paddingInline: "clamp(28px, 5.6vw, 112px)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.055] bg-[repeating-linear-gradient(0deg,rgba(230,226,218,0.7)_0px,rgba(230,226,218,0.7)_1px,transparent_1px,transparent_7px)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-1/2 h-44 -translate-y-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(209,10,10,0.2)_50%,transparent_100%)] blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-red-bright/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative w-full">
        <div className="max-w-[980px] border-l border-text-primary/20 pl-6 sm:pl-9">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-accent-red-bright">
            &gt; Contact / Start project
          </p>

          <h2 className="font-heading text-[42px] font-bold uppercase leading-[1.02] tracking-[0.06em] text-text-primary drop-shadow-[0_0_24px_rgba(230,226,218,0.22)] sm:text-[64px] lg:text-[86px]">
            Хочешь сайт, который не выглядит как очередной шаблон?
          </h2>

          <p className="mt-8 max-w-[680px] font-subheading text-[19px] leading-8 text-text-muted sm:text-[24px] sm:leading-[1.55]">
            Напиши мне — обсудим задачу и подачу проекта.
          </p>
        </div>

        <div className="mt-12 grid gap-4 font-mono text-xs uppercase tracking-[0.16em] sm:grid-cols-3">
          {contactLinks.map((link) => (
            <a
              className="group flex min-h-16 items-center justify-between border border-accent-red-bright/55 bg-accent-red/12 px-6 text-text-primary shadow-[0_0_36px_rgba(209,10,10,0.22),inset_0_0_28px_rgba(255,255,255,0.025)] transition-colors duration-200 hover:border-accent-red-bright hover:bg-accent-red-bright/75 hover:text-white"
              href={link.href}
              key={link.label}
            >
              <span>{link.label}</span>
              <span className="text-lg leading-none" aria-hidden="true">
                -&gt;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
