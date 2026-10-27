const navItems = [
  { label: "ОБО МНЕ", href: "#about" },
  { label: "РАБОТЫ", href: "#work" },
  { label: "КОНТАКТЫ", href: "#contact" },
];

export default function Header({ casePage = false }: { casePage?: boolean }) {
  return (
    <header
      className={`${casePage ? "" : "hero-home-header "}site-header pointer-events-none fixed z-50 bg-transparent before:fixed before:inset-x-0 before:top-0 before:-z-10 before:h-[calc(var(--hero-header-top)+var(--hero-header-height)+18px)] before:bg-[linear-gradient(180deg,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.44)_42%,rgba(5,5,5,0.16)_72%,rgba(5,5,5,0)_100%)] before:content-['']`}
      style={{
        top: "var(--hero-header-top)",
        left: "calc(var(--hero-rail-x) + var(--hero-header-inset, var(--hero-copy-offset)))",
        right: "calc(var(--hero-rail-x) + var(--hero-header-inset, var(--hero-copy-offset)))",
      }}
    >
      <div
        className="pointer-events-auto flex w-full flex-col items-center justify-center gap-2 text-center md:flex-row md:items-center md:justify-between md:gap-0"
        style={{ height: "var(--hero-header-height)" }}
      >
        <a
          href="/"
          className="site-header-logo flex items-center justify-center font-heading text-[20px] font-bold uppercase leading-none tracking-[0.18em] text-text-primary transition-colors duration-200 hover:text-white md:text-[24px] md:tracking-[0.2em]"
          aria-label="DIZFANIT — на главную"
        >
          DIZFANIT
        </a>

        <nav className="w-full sm:w-auto" aria-label="Основная навигация">
          <ul className="hidden items-center justify-center gap-10 text-center font-mono text-sm font-semibold uppercase leading-none tracking-[0.56em] text-text-primary md:flex">
            {navItems.map((item) => (
              <li className="flex items-center gap-10" key={item.href}>
                <a
                  href={casePage ? `/${item.href}` : item.href}
                  className="site-header-nav-link transition-colors duration-200"
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

          <ul className="flex w-full items-center justify-center gap-5 text-center font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-text-primary md:hidden">
            {navItems.map((item) => (
              <li key={item.href}>
                <a className="site-header-nav-link transition-colors duration-200" href={casePage ? `/${item.href}` : item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
