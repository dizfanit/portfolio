# Unify What I Build with the portfolio

This living ExecPlan follows PLANS.md. Scope is components/Services.tsx, its .build-* CSS in app/globals.css, and Services documentation. Existing uncommitted work must be preserved.

## Purpose / Big Picture

Visitors should see eight clear design capabilities in a polished graphite/red composition consistent with Hero, About and Work. Preserve all eight titles and descriptions. Use shared typography, the twelve-column layout and shared corner markers. Add small vector compositions illustrating the services without image downloads or new client JavaScript.

## Progress

- [x] (2026-10-11) Read current Services, shared tokens, frame geometry and responsive guidance; checked git status.
- [x] (2026-10-11) Rebuilt the section and scoped .build-* styling, preserving all eight service titles and descriptions.
- [x] (2026-10-11) Production build passed; QHD layout, typography, shared frame, hover and Services → Process → Services navigation checked.
- [x] (2026-10-11) Updated Services documentation and recorded validation.

## Surprises & Discoveries

The current section uses a separate eight-span corner implementation, arbitrary 104px display type and smaller card copy. Shared sections use .section-guide-frame and four .section-frame-corner spans; --hero-title-size is 64px and --hero-lead-size is 22px at QHD. There are extensive pre-existing edits across the repository.

The dev server briefly served stale CSS after the production build; a subsequent CSS update refreshed it. No server restart or cache deletion was needed. Browser default screenshots cropped the emulated viewport; a document-coordinate clip produced the complete QHD section.

## Decision Log

Use a heading and introduction above a four-by-two service grid. Each card has a distinct vector miniature, readable copy and a restrained red hover accent. Keep the current English titles and Russian descriptions. Use server-rendered SVG and CSS only, with reduced-motion overrides. This makes the visual richer without adding client state or asset requests. Date: 2026-10-11.

Remove the old side terminal labels instead of adding new rails: the shared four corners and technical eyebrow provide enough framing. Keep the global design tokens unchanged. Date: 2026-10-11.

## Outcomes & Retrospective

Delivered a four-by-two grid with eight distinct red/graphite SVG miniatures, unified type, quieter framing and preserved service copy. The 1440px-high section contains all cards and the footer. No new runtime dependencies or client effects. Compact layouts are implemented; mobile screenshots were deliberately not taken per docs/design/responsive.md. The scoped change leaves protected sections and existing working-tree changes intact.

## Context and Orientation

app/page.tsx renders Services between SelectedCases and Process. Services is a server component with a local array of eight capabilities. app/globals.css contains one contiguous .build-* section before .about-section. Global design tokens define typography and geometry; these must remain unchanged. The site uses full-screen section scrolling, so QHD content must fit within the shared frame. On narrower screens cards may stack and the section must grow naturally.

## Plan of Work

Replace the old icons and terminal chrome in Services with purposeful miniature layouts for web, slides, products, brand, packaging, social, advertising and no-code. Reuse shared frame classes and omit the old side rails. Replace only the .build-* CSS block with a twelve-column composition, shared text roles and internal inset. Preserve section id services and order. Update docs/sections/services.md with the final design and behavior.

## Concrete Steps

Work in C:\Users\Dizfa\Desktop\Portfolio. Edit the scoped files, then run npm.cmd run build. Use the existing dev server at http://127.0.0.1:3000 and inspect Services at 2560×1440 with browser tools. Check the card count, shared frame coordinates, text sizes, overflow and bottom content. Exercise section navigation. Do not start another server if the existing one responds.

## Validation and Acceptance

The production build must finish successfully. The heading must use --hero-title-size, body and card titles --hero-lead-size, technical labels --hero-eyebrow-size. All eight descriptions must remain visible and readable, with no overlaps or horizontal scroll. Frame corners must match the shared frame used above. Hover motion must respect prefers-reduced-motion. Compact styles must allow a two-column and then one-column flow without fixed-height clipping; the repository asks for mobile screenshots only when a serious regression is suspected.

## Idempotence and Recovery

Edits are local and reversible. Re-run the build after repairs. Revert only this task's changes if necessary, never reset app/globals.css wholesale because it already contains unrelated edits. No dependencies, global tokens, routes or protected interactions change.

## Artifacts and Notes

Production build: compiled successfully, TypeScript and static-page generation completed. Browser inspection at 2560×1440 reported eight cards, title 64px, intro/card text 22px, eyebrow 16px, and no text overflow. Hero, About, Work and Services frame insets all measured 128px horizontally and 72px vertically. Last card bottom was 1177.78px within the 1440px section; footer ended at 1274.30px. Hover border reached rgb(209, 10, 10). PageDown reached Process at top 0, and PageUp returned to Services. Scoped git diff --check passed.

## Interfaces and Dependencies

Keep the default Services export and the id services. Use React JSX, inline SVG and existing CSS only. Decorative SVGs are aria-hidden and noninteractive cards do not receive tab stops. Preserve semantic article and heading structure.

Initial plan created 2026-10-11 before implementation.

Completed 2026-10-11 with measured QHD results and the final choice to simplify side chrome.
