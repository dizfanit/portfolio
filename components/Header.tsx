const navItems = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  return (
    <header
      className="fixed z-50 bg-transparent"
      style={{
        top: "var(--hero-header-top)",
        left: "calc(var(--hero-rail-x) + var(--hero-copy-offset))",
        right: "calc(var(--hero-rail-x) + var(--hero-copy-offset))",
      }}
    >
      <div
        className="flex w-full flex-col items-center justify-center gap-2 text-center md:flex-row md:items-center md:justify-between md:gap-0"
        style={{ height: "var(--hero-header-height)" }}
      >
        <a
          href="/"
          className="flex items-center justify-center font-heading text-[20px] font-bold uppercase leading-none tracking-[0.18em] text-text-primary drop-shadow-[0_0_12px_rgba(230,226,218,0.55)] transition-colors duration-200 hover:text-white md:text-[24px] md:tracking-[0.2em]"
          aria-label="DIZFANIT home"
        >
          DIZFANIT
        </a>

        <nav className="w-full sm:w-auto" aria-label="Main navigation">
          <ul className="hidden items-center justify-center gap-10 text-center font-mono text-sm font-semibold uppercase leading-none tracking-[0.56em] text-text-primary md:flex">
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

          <ul className="flex w-full items-center justify-center gap-3 text-center font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-text-primary md:hidden">
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
