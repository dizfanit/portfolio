# DIZFANIT design system

Status: approved baseline. Use this file as the source of truth for typography when creating or changing sections, cards, pages, and responsive layouts.

Do not introduce arbitrary text sizes unless the user explicitly asks to extend the system. If a new role is needed, add it here first, then use it in CSS.

## Visual direction

- Dark graphite background, off-white text, red accents.
- Technical mono labels, CRT/grid/focus-frame feeling.
- Large uppercase display typography with controlled hierarchy.
- Hero is allowed to be the strongest typographic moment.
- Section headings should feel consistent across `About`, `Work`, `Services`, `Process`, `Contact`, and case pages.
- Cards should not visually compete with section headings.

## Breakpoints

Typography uses separate ranges instead of one global `clamp()`. This prevents Full HD from looking correct while 2K looks too small.

| Range | Width | Rule |
| --- | --- | --- |
| Mobile | `320-767px` | Separate compact scale for Russian text and narrow screens. |
| Tablet | `768-1199px` | Transitional scale between mobile and desktop. |
| Desktop | `1200-1919px` | Main scale for laptops and Full HD. |
| Wide desktop | `1920-2559px` | Text grows again so 2K screens do not feel under-scaled. |
| Ultra wide | `2560px+` | Fixed caps to stop typography from growing forever. |

## Layout grid

All new sections and blocks must align to the existing site grid. Do not create a separate layout system unless the user explicitly asks for a different composition.

Existing grid primitives:

| Primitive | Source | Use |
| --- | --- | --- |
| `.site-shell` | `app/globals.css` | Outer page padding. Use it for main full-width sections. |
| `--hero-rail-x` | `app/globals.css` | Left/right rail inset and page-safe horizontal boundary. |
| `--hero-grid-gap` | `app/globals.css` | Shared column gap. |
| `--hero-grid-col` | `app/globals.css` | Derived 12-column unit. Use for alignment math and decorative offsets. |
| `--hero-grid-row` | `app/globals.css` | Vertical rhythm unit for rails, focus marks, and section framing. |
| `--hero-copy-offset` | `app/globals.css` | Inner text/content offset used by hero-like section compositions. |
| `GridOverlay` | `components/GridOverlay.tsx` and `components/GridOverlay.module.css` | Visual reference for the global 12-column grid. |

Grid rules:

1. Full-width sections should use `.site-shell`.
2. Desktop layouts should use the project 12-column grid: `repeat(12, minmax(0, 1fr))` with `gap` or `column-gap` tied to `var(--hero-grid-gap)`.
3. Tablet layouts can collapse to 6 columns when 12 columns become too dense.
4. Mobile layouts collapse to a single column unless a small local grid is needed inside a card or control.
5. Decorative rails, corner frames, scan-grid backgrounds, and absolute HUD elements should align to `--hero-rail-x`, `--hero-grid-row`, `--hero-grid-col`, or `--hero-copy-offset`.
6. Do not use arbitrary section padding that visually breaks the rails. Start from `.site-shell`, then add internal offsets with existing variables.
7. If a block needs a custom composition, still anchor its outer edges and major content columns to the existing grid.
8. If the grid and text length conflict, adjust column span, max-width, wrapping, or layout density before changing typography tokens.

## Typography tokens

| Token | Mobile | Tablet | Desktop | Wide desktop | Usage |
| --- | --- | --- | --- | --- | --- |
| `--type-display-xl` | `clamp(42px, 12.8vw, 58px)` | `clamp(58px, 8vw, 82px)` | `clamp(84px, 5.8vw, 112px)` | `clamp(112px, 5.15vw, 132px)` | Main hero H1 |
| `--type-display-lg` | `clamp(38px, 11.5vw, 54px)` | `clamp(54px, 7.2vw, 72px)` | `clamp(68px, 4.4vw, 86px)` | `clamp(86px, 4.2vw, 108px)` | Section titles |
| `--type-display-md` | `clamp(32px, 9vw, 42px)` | `clamp(42px, 5.8vw, 52px)` | `clamp(48px, 3.2vw, 64px)` | `clamp(64px, 3vw, 76px)` | Large inner titles and mockup text |
| `--type-title-xl` | `clamp(32px, 8.8vw, 42px)` | `clamp(40px, 5vw, 54px)` | `clamp(46px, 3.4vw, 64px)` | `clamp(58px, 3vw, 72px)` | Featured case/card title |
| `--type-title-lg` | `clamp(26px, 7.5vw, 34px)` | `clamp(30px, 4.2vw, 38px)` | `clamp(34px, 2.4vw, 42px)` | `clamp(38px, 2vw, 48px)` | Normal cards, process steps, case block titles |
| `--type-title-md` | `clamp(22px, 6.4vw, 28px)` | `clamp(24px, 3.4vw, 30px)` | `clamp(26px, 1.8vw, 32px)` | `clamp(30px, 1.55vw, 36px)` | Small cards and secondary accents |
| `--type-lead` | `clamp(18px, 4.8vw, 21px)` | `clamp(19px, 2.5vw, 22px)` | `clamp(20px, 1.25vw, 24px)` | `clamp(23px, 1.08vw, 28px)` | Lead text under hero or section titles |
| `--type-body` | `clamp(16px, 4.2vw, 18px)` | `clamp(16px, 2vw, 18px)` | `clamp(17px, 1vw, 19px)` | `clamp(18px, 0.86vw, 22px)` | Main paragraph text |
| `--type-body-sm` | `clamp(14px, 3.8vw, 16px)` | `clamp(15px, 1.8vw, 16px)` | `clamp(15px, 0.9vw, 17px)` | `clamp(16px, 0.75vw, 18px)` | Card descriptions and short support text |
| `--type-meta` | `clamp(11px, 3vw, 12px)` | `clamp(12px, 1.45vw, 13px)` | `clamp(12px, 0.72vw, 14px)` | `clamp(13px, 0.62vw, 15px)` | Eyebrows, nav, labels, status text |
| `--type-micro` | `clamp(10px, 2.6vw, 11px)` | `clamp(10px, 1.2vw, 12px)` | `clamp(11px, 0.6vw, 12px)` | `clamp(12px, 0.52vw, 13px)` | HUD, captions, technical tiny labels |

Ultra-wide fixed caps:

| Token | `2560px+` |
| --- | --- |
| `--type-display-xl` | `132px` |
| `--type-display-lg` | `108px` |
| `--type-display-md` | `76px` |
| `--type-title-xl` | `72px` |
| `--type-title-lg` | `48px` |
| `--type-title-md` | `36px` |
| `--type-lead` | `28px` |
| `--type-body` | `22px` |
| `--type-body-sm` | `18px` |
| `--type-meta` | `15px` |
| `--type-micro` | `13px` |

## CSS implementation reference

When the user asks to apply the system to the site, add these variables to `:root` in `app/globals.css`.

```css
:root {
  --type-display-xl: clamp(42px, 12.8vw, 58px);
  --type-display-lg: clamp(38px, 11.5vw, 54px);
  --type-display-md: clamp(32px, 9vw, 42px);
  --type-title-xl: clamp(32px, 8.8vw, 42px);
  --type-title-lg: clamp(26px, 7.5vw, 34px);
  --type-title-md: clamp(22px, 6.4vw, 28px);
  --type-lead: clamp(18px, 4.8vw, 21px);
  --type-body: clamp(16px, 4.2vw, 18px);
  --type-body-sm: clamp(14px, 3.8vw, 16px);
  --type-meta: clamp(11px, 3vw, 12px);
  --type-micro: clamp(10px, 2.6vw, 11px);
}

@media (min-width: 768px) {
  :root {
    --type-display-xl: clamp(58px, 8vw, 82px);
    --type-display-lg: clamp(54px, 7.2vw, 72px);
    --type-display-md: clamp(42px, 5.8vw, 52px);
    --type-title-xl: clamp(40px, 5vw, 54px);
    --type-title-lg: clamp(30px, 4.2vw, 38px);
    --type-title-md: clamp(24px, 3.4vw, 30px);
    --type-lead: clamp(19px, 2.5vw, 22px);
    --type-body: clamp(16px, 2vw, 18px);
    --type-body-sm: clamp(15px, 1.8vw, 16px);
    --type-meta: clamp(12px, 1.45vw, 13px);
    --type-micro: clamp(10px, 1.2vw, 12px);
  }
}

@media (min-width: 1200px) {
  :root {
    --type-display-xl: clamp(84px, 5.8vw, 112px);
    --type-display-lg: clamp(68px, 4.4vw, 86px);
    --type-display-md: clamp(48px, 3.2vw, 64px);
    --type-title-xl: clamp(46px, 3.4vw, 64px);
    --type-title-lg: clamp(34px, 2.4vw, 42px);
    --type-title-md: clamp(26px, 1.8vw, 32px);
    --type-lead: clamp(20px, 1.25vw, 24px);
    --type-body: clamp(17px, 1vw, 19px);
    --type-body-sm: clamp(15px, 0.9vw, 17px);
    --type-meta: clamp(12px, 0.72vw, 14px);
    --type-micro: clamp(11px, 0.6vw, 12px);
  }
}

@media (min-width: 1920px) {
  :root {
    --type-display-xl: clamp(112px, 5.15vw, 132px);
    --type-display-lg: clamp(86px, 4.2vw, 108px);
    --type-display-md: clamp(64px, 3vw, 76px);
    --type-title-xl: clamp(58px, 3vw, 72px);
    --type-title-lg: clamp(38px, 2vw, 48px);
    --type-title-md: clamp(30px, 1.55vw, 36px);
    --type-lead: clamp(23px, 1.08vw, 28px);
    --type-body: clamp(18px, 0.86vw, 22px);
    --type-body-sm: clamp(16px, 0.75vw, 18px);
    --type-meta: clamp(13px, 0.62vw, 15px);
    --type-micro: clamp(12px, 0.52vw, 13px);
  }
}

@media (min-width: 2560px) {
  :root {
    --type-display-xl: 132px;
    --type-display-lg: 108px;
    --type-display-md: 76px;
    --type-title-xl: 72px;
    --type-title-lg: 48px;
    --type-title-md: 36px;
    --type-lead: 28px;
    --type-body: 22px;
    --type-body-sm: 18px;
    --type-meta: 15px;
    --type-micro: 13px;
  }
}
```

## Mapping

| Site element | Token |
| --- | --- |
| `Hero` H1 | `--type-display-xl` |
| `Hero` lead | `--type-lead` |
| `Hero` buttons | `--type-body-sm` |
| Section eyebrows | `--type-meta` |
| Section titles | `--type-display-lg` |
| Section lead/copy | `--type-lead` |
| Normal paragraphs | `--type-body` |
| Card descriptions | `--type-body-sm` |
| Featured case title | `--type-title-xl` |
| Normal card title | `--type-title-lg` |
| Small card title | `--type-title-md` |
| HUD/status/rails/captions | `--type-micro` or `--type-meta` |
| Header logo | `--type-title-md` |
| Header nav | `--type-meta` |
| Case page H1 | `--type-display-lg` |
| Case page body | `--type-body` |

## Rules for future work

1. Do not add raw `text-[...]`, `font-size: 17px`, or one-off `rem` values for normal UI text.
2. Every text element must map to a role: `display`, `title`, `lead`, `body`, `meta`, or `micro`.
3. Hero may be larger than the rest only through `--type-display-xl`.
4. All section titles use `--type-display-lg`.
5. Ordinary cards never use `--type-display-*`.
6. Featured cards may use `--type-title-xl`, but not display tokens.
7. Wide desktop must be checked as its own range when changing typography.
8. Mobile typography is its own scale, not a scaled-down desktop.
9. If the layout breaks because of text length, first adjust layout width/wrapping, not the global token.
10. If the user asks for a new section in a new chat, read this file before choosing text sizes.
11. If the user asks for a new block in a new chat, align it to the documented layout grid before inventing a new composition.

## Verification targets

For typography or layout work, verify the relevant affected screens. Preferred viewport set:

- `390px` mobile
- `768px` tablet
- `1280px` small desktop
- `1440px` desktop
- `1920px` Full HD / wide threshold
- `2560px` 2K / ultra-wide cap
