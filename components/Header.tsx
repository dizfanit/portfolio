const navItems = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  return (
    <header
      className="fixed left-0 top-0 z-50 w-full bg-transparent"
      style={{ paddingInline: "clamp(28px, 5.3vw, 108px)" }}
    >
      <div className="flex h-24 w-full flex-col items-start justify-center gap-2 sm:h-[118px] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <a
          href="/"
          className="flex items-center font-heading text-[20px] font-bold uppercase leading-none tracking-[0.08em] text-text-primary drop-shadow-[0_0_12px_rgba(230,226,218,0.55)] transition-colors duration-200 hover:text-white sm:text-[24px]"
          aria-label="DIZFANIT home"
        >
          DIZFANIT
        </a>

        <nav className="w-full sm:w-auto" aria-label="Main navigation">
          <ul className="hidden items-center gap-10 font-mono text-sm font-semibold uppercase leading-none tracking-[0.48em] text-text-primary sm:flex">
            {navItems.map((item) => (
              <li className="flex items-center gap-10" key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors duration-200 hover:text-accent-red-bright"
                >
                  {item.label}
                </a>
                {item.href !== "#contact" ? (
                  <span
                    className="h-1 w-1 bg-accent-red-bright"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            ))}
          </ul>

          <ul className="flex w-full items-center justify-start gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-text-primary sm:hidden">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
