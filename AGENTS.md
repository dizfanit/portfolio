# AGENTS.md

## Purpose

This file is the first stop for Codex and other coding agents working in this
repository. Keep context usage low: read this file first, then inspect only the
files directly relevant to the task.

## ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as
described in `.agent/PLANS.md`) from design to implementation.

## Project Snapshot

- Project: personal portfolio for DIZFANIT DESIGN.
- Framework: Next.js 16 App Router with React 19 and TypeScript.
- Styling: Tailwind CSS 4 via `@import "tailwindcss"` in `app/globals.css`.
- Motion: `framer-motion`.
- Package manager: npm, with `package-lock.json` committed.

## Design System

- The active design system lives in `app/globals.css`: CSS variables, section
  classes, typography sizing, site grid, responsive rules, and visual tokens.
- Before creating or changing sections, cards, pages, or typography, inspect the
  relevant `app/globals.css` tokens/classes and the component being changed.
- Do not introduce one-off text sizes with raw `text-[...]`, `font-size`, or ad
  hoc `rem` values unless the user explicitly asks to extend the design system.
- Keep hero, section headings, cards, lead text, body text, meta labels, and
  mobile/wide-desktop scaling mapped to existing tokens in `app/globals.css`.
- New sections and blocks must align to the existing site grid:
  `.site-shell`, `--hero-rail-x`, `--hero-grid-gap`, `--hero-grid-col`,
  `--hero-grid-row`, and the 12-column desktop grid. Do not invent a separate
  grid unless the user asks for it.
- Content areas inside sections must use an inner inset on all sides by
  default, using `--section-inner-inset`, unless the user explicitly asks for an
  edge-to-edge composition.

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Build: `npm run build`
- Start production server: `npm run start`

### Local Windows launch note

- In this workspace PowerShell may block `npm` because `npm.ps1` is disabled by
  execution policy. Use `npm.cmd run dev` instead of `npm run dev`.
- If `next dev` reports that another dev server is already running, keep it and
  open `http://localhost:3000`. The existing server is the correct site process.
- To start the dev server from Codex without changing PowerShell policy, run
  `npm.cmd run dev` or invoke Next directly with
  `node node_modules\next\dist\bin\next dev`.

There are no dedicated lint or test scripts in `package.json` right now. For
most code changes, use `npm run build` as the main verification step.

## File Map

- `app/layout.tsx`: root layout, metadata, global CSS import, custom cursor,
  CRT frame, and grid overlay.
- `app/page.tsx`: home page composition. It wires together the main portfolio
  sections.
- `app/work/[slug]/page.tsx`: dynamic case page route. Uses async `params`,
  `generateStaticParams`, and data from `data/cases.ts`.
- `app/globals.css`: Tailwind import, font faces, theme tokens, base styles,
  CRT treatment, responsive layout styles, and major global visual rules.
- `components/`: section and experience components:
  - `Hero.tsx`
  - `Header.tsx`
  - `About.tsx`
  - `SelectedCases.tsx`
  - `Services.tsx`
  - `Process.tsx`
  - `Contact.tsx`
  - `Preloader.tsx`
  - `CustomCursor.tsx`
  - `GridOverlay.tsx`
  - `GridOverlay.module.css`
- `data/cases.ts`: case metadata used by the selected cases section and the
  dynamic case route.
- `public/`: static assets, including fonts, videos, posters, and images.

## Context Budget Rules

- At the start of a task, read `AGENTS.md` first, then only the files directly
  relevant to the request. Do not scan the whole project "just in case".
- Prefer `rg` and `rg --files` for discovery.
- Avoid broad reads of `node_modules`, `.next`, `.vercel`, `dist`, `build`,
  `coverage`, logs, videos, images, and font binaries.
- Do not open large files in full unless the task genuinely requires it.
  For big CSS or component files, read targeted ranges or use `rg` first.
- Start from these files for most tasks:
  - structure/routing: `app/layout.tsx`, `app/page.tsx`,
    `app/work/[slug]/page.tsx`
  - visual system: `app/globals.css`
  - portfolio content: `data/cases.ts`
  - section behavior: the named component in `components/`
- Before inspecting more than about 5-7 files, pause and explain why the wider
  search is needed.
- Reuse findings from this file instead of rediscovering the project structure.
- For visual/typography work, inspect only the relevant `app/globals.css`
  tokens/classes and the component/CSS ranges that are being changed.

## Workspace Hygiene

- Clean up after every completed task. Remove temporary files created during the
  task, including scratch scripts, downloaded references, debug screenshots,
  one-off exports, temporary reports, and generated test artifacts that are not
  part of the requested deliverable.
- Do not leave accidental files in the project root. If a temporary file is
  needed while working, place it in an obvious temporary location and delete it
  before the final response.
- Keep intentional deliverables, source changes, committed project assets, and
  user-provided files. Never delete files that existed before the task unless
  the user explicitly asks.
- Do not clean `node_modules`, `.next`, package lockfiles, public assets, logs,
  or other project state unless the cleanup is directly requested and the impact
  is clear.
- Before finalizing a task that created files, check the changed/created files
  and mention any remaining intentional artifact in the final response.

## Protected UX Systems

Treat these parts as protected unless the user explicitly asks to change them.
Before editing nearby code, identify the owning file and preserve existing
behavior.

- Preloader: `components/Preloader.tsx`. Preserve timing, transition feel,
  layering, and the handoff into the main page.
- CRT / television effect: `app/globals.css`, `app/layout.tsx`,
  `components/GridOverlay.tsx`, and `components/GridOverlay.module.css`.
  Preserve the fixed CRT frame, screen curvature, overlays, scan/grid feel, and
  pointer-event behavior.
- Custom cursor and mouse movement: `components/CustomCursor.tsx`. Preserve
  tracking, hover states, event listeners, cleanup, and performance safeguards.
- Hero visual system: `components/Hero.tsx`, related tokens in
  `app/globals.css`, and assets in `public/`. Preserve the first-screen
  composition, video/poster behavior, responsive positioning, focus corners,
  and CTA layout.
- Page section order: `app/page.tsx`. Preserve the current order:
  `Preloader`, `Header`, `Hero`, `About`, `SelectedCases`, `Services`,
  `Process`, `Contact`.
- Portfolio cases: `components/SelectedCases.tsx`, `data/cases.ts`, and
  `app/work/[slug]/page.tsx`. Preserve slug routing and static params when
  changing case data or cards.
- Global visual tokens: `app/globals.css`. Preserve font faces, Tailwind theme
  tokens, color variables, hero sizing variables, and global overflow behavior
  unless the task is specifically about the visual system.

## Safe Change Protocol

- For a request that touches a protected system, read only that system first,
  then name the likely blast radius before editing.
- Do not rewrite protected components wholesale. Make the smallest targeted
  change that solves the task.
- When changing layout or animation, check desktop and mobile behavior.
- When changing event-driven code, confirm listeners are cleaned up and no
  browser-only APIs run during server render.
- When changing global CSS variables, search for every variable use with `rg`
  before editing.
- If a change might affect preloader, cursor, CRT frame, hero, or section order,
  call that out in the final response and mention how it was verified.

## Editing Guidelines

- Follow the existing design language: dark graphite background, off-white text,
  red accents, mono technical labels, large uppercase display typography, CRT
  frame/grid treatment.
- Keep changes scoped to the requested area. Do not refactor unrelated sections.
- Preserve user changes in the working tree. Current dirty files may be user
  work; inspect carefully before editing them.
- Use existing components and theme tokens before adding new abstractions.
- For public assets, reference files through `/...` paths from `public/`.
- Keep TypeScript strict-friendly.

## Responsive Layout Requirements

- Always design and implement every block with responsive behavior in mind from
  the start, not as a cleanup step after desktop is finished.
- Use representative desktop and mobile checks when the change meaningfully
  affects layout, spacing, typography, or overflow. Do not require exhaustive
  rechecks across 2K/QHD, Full HD, HD, and mobile for every visual change.
- Desktop breakpoints should preserve the same composition, proportions, visual
  rhythm, hierarchy, and perceived spacing unless the available height/width
  genuinely requires a different layout.
- For each new or changed section, check that typography, media, grids, sticky
  or absolute elements, CTAs, and decorative CRT/focus elements scale without
  overlap, clipping, awkward empty space, or unexpected horizontal scrolling.
- Prefer fluid constraints (`clamp`, `minmax`, responsive grid tracks,
  max-widths, aspect ratios, and existing theme variables) over hard-coded sizes
  that only work at one resolution.

## Verification Notes

- Run `npm run build` after TypeScript, routing, or component changes.
- For visual changes, run the dev server and verify the affected viewport in a
  browser when practical.
- For layout or section changes, verify the affected viewport(s) that match the
  actual risk of the change.
- For protected UX systems, verify the relevant behavior directly:
  - preloader appears and hands off cleanly;
  - CRT frame/grid stays fixed over the page without blocking clicks;
  - custom cursor follows movement and hover states still respond;
  - hero media/poster renders and remains framed correctly;
  - page sections remain in the intended order;
  - case links still resolve to `/work/[slug]` pages.
- If verification is skipped, say exactly why in the final response.
