# Адаптировать блок About от QHD до телефона

This ExecPlan is a living document. Maintain it according to `PLANS.md` at the repository root. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` current.

## Purpose / Big Picture

The second section of the home page, About, should keep its portrait, text hierarchy, and three information panels across QHD, Full HD, and HD. On a phone, the title, copy, panel content, and status should follow the center axis inside the site frame. Visitors must be able to reach every item on short screens by scrolling. Open `http://localhost:3000/#about` at the dimensions below to see the result.

## Progress

- [x] (2026-10-15 15:06Z) Read repository instructions, `docs/design/responsive.md`, the About component and its CSS, and inspected baseline layouts.
- [x] (2026-10-15 15:19Z) Adjusted About-specific layout and mobile alignment without changing global design tokens or other sections.
- [x] (2026-10-15 15:19Z) Verified lower panels and status are reachable at 1280×720 and 320×568, including transition to Work.
- [x] (2026-10-15 15:19Z) Built, inspected QHD/Full HD/HD/mobile views, updated About and responsive documentation, and recorded outcomes.

## Surprises & Discoveries

- At 2560×1440 the three panels and status fit inside the 1440px section. At 1920×1080 they fit inside 1080px.
- At 1280×720 About is about 951px tall. Its status ends near 909px, below the viewport; global section-by-section wheel navigation needs checking so this content remains reachable.
- At 390×844 the About content is about 1793px tall. Its title and introduction are left aligned, while the fixed header occupies the same upper area when About begins.
- At 1280×720, clearing the fixed header increases About height to about 1029px. The old section wheel jump skipped the bottom 309px, so About needs an internal reading path on desktop.
- At 768–999px, the previous two-column infographic minimum widths could exceed the available width. A single column resolves that breakpoint without shrinking panel text.
- At 320–390px, the centered About content and panels have no horizontal overflow. At 320×568 the status is visible after native scrolling, before Work.
- Returning from Work to the bottom of About was tried, but snap state was inconsistent at the target. The existing return to the start of About remains, and scrolling from About through its bottom is verified.

## Decision Log

- Decision: Keep the existing 12-column desktop layout, portrait asset, information panels, animation, and shared typography tokens. Make About-specific CSS changes first.
  Rationale: `docs/design/responsive.md` requires the same content and hierarchy at QHD, Full HD, and HD, while `AGENTS.md` limits the scope of changes.
  Date/Author: 2026-10-15, Codex.
- Decision: Let phone layouts grow vertically rather than shrink body text to fit one screen.
  Rationale: The mobile home page now uses continuous scrolling, and the responsive rules prioritize readable text and reachable content.
  Date/Author: 2026-10-15, Codex.
- Decision: Keep section transitions on desktop, but allow ordinary internal scrolling while About exceeds the viewport.
  Rationale: The 1280×720 composition remains legible at existing type sizes and all lower content becomes reachable before Work.
  Date/Author: 2026-10-15, Codex.

## Outcomes & Retrospective

About keeps its portrait and three panels on QHD/Full HD. HD adds clearance beneath the fixed header and permits internal reading before the section transition. The mobile title, text, headings, rows, meters, and status follow the center axis; the full section stays readable on a 320px phone. The 768–999px infographic uses one column to avoid overflow. `npm.cmd run build` completed successfully, and `git diff --check` found no whitespace errors. Browser checks covered 2560×1440, 1920×1080, 1280×720, 999×768, 768×1024, 390×844, 375×667, 360×780, and 320×568. The reduced-motion variant uses existing static content and snap-free CSS but was not separately emulated in the browser.

## Context and Orientation

`components/About.tsx` renders the section at `#about`: a background `LiquidReveal`, frame and rails, a title/introduction, three information panels, and a status line. `app/globals.css` owns the `.about-*` rules. The site uses `--hero-rail-x` for outer rails, `--section-inner-inset` for content inset, and a 12-column desktop grid. `components/SmoothSectionScroll.tsx` controls section navigation on desktop; phones at 767px and below use native continuous scrolling. `docs/design/responsive.md` defines target sizes and the phone center axis. Many unrelated edits already exist in the working tree; preserve them.

## Plan of Work

First, modify only `.about-*` selectors in `app/globals.css` so the desktop composition scales between 2560×1440, 1920×1080, and 1280×720 without hiding content. On phones, add enough clearance under the fixed header and center the title, introduction, panel headings and contents, and status within the section's existing inset. Keep the content order and animation in `components/About.tsx`. Adjust line-break behavior only if the existing desktop break harms phone wrapping.

Next, inspect the 1280×720 scrolling path. If desktop section navigation skips the lower About content, make the smallest About-specific change in `components/SmoothSectionScroll.tsx` that allows the long section to be read while preserving transitions elsewhere. Record the decision and verify it in the browser.

Finally, update `docs/sections/about.md` and any changed facts in `docs/design/responsive.md`. Run a production build and visually inspect all target sizes.

## Concrete Steps

Run from `C:\Users\Dizfa\Desktop\Portfolio`:

    npm.cmd run build

Expect `Compiled successfully` and TypeScript to complete. Use the already running local server at `http://localhost:3000/`, or run `npm.cmd run dev` if it is stopped. Inspect `#about` at 2560×1440, 1920×1080, 1280×720, 390×844, 375×667, 360×780, and 320×568. Compare each visible panel and its coordinates with the section boundaries. Scroll through the full About section on short screens.

## Validation and Acceptance

At QHD and Full HD, About retains the same portrait background, introductory text, three panels, and status, with no overlap or horizontal overflow. At HD the same information stays legible and the lower panels/status are reachable before Work. At phone widths, the title, introduction, panel headers, panel contents, and status are centered in the frame; the header does not cover the title; narrow text wraps cleanly; and the page can scroll to the final line. Reduced-motion users should see the same static content.

## Idempotence and Recovery

CSS edits and the build can be repeated. Do not reset the working tree or remove existing assets. If visual verification fails, keep the plan active, record the exact size and failure here, and revise only the About-specific rules needed to resolve it.

## Artifacts and Notes

Baseline browser measurements: QHD section height 1440px and panel bottom 1318px; Full HD section height 1080px and panel bottom 979px; HD section height about 951px and status bottom about 909px. At 390px the panel stack fills about 1793px, so vertical scrolling is expected.

## Interfaces and Dependencies

No new library or component interface is planned. The existing `About` React component, Framer Motion variants, CSS custom properties, and optional desktop `SmoothSectionScroll` behavior remain the interfaces to use.

Revision note, 2026-10-15: Created the plan after initial source and browser inspection because this request spans several viewport compositions and a possible scroll reachability change.
