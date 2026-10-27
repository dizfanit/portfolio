# Исправить композицию About на HD и телефонах

This ExecPlan is a living document maintained according to `PLANS.md` at the repository root. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` current.

## Purpose / Big Picture

Visitors should see the second home page section as one coherent composition at 2560×1440, 1920×1080, and 1280×720. On phones the portrait should be visible behind the opening content, card rows should be easy to scan, and scrolling should never put the fixed navigation text over card text. Open `http://localhost:3000/#about` and compare the viewports in `docs/design/responsive.md` to observe the result.

## Progress

- [x] (2026-10-25 17:28Z) Read repository and responsive instructions, inspected the existing About CSS and component, and captured QHD, HD, and mobile views.
- [x] (2026-10-25 17:45Z) Compacted About at 1280×720 and smoothed spacing through 1535px while retaining the 12-column layout and moving panels left of the portrait.
- [x] (2026-10-25 17:45Z) Repaired phone portrait crop, card rows, and header overlap without changing Hero's initial appearance.
- [x] (2026-10-25 17:49Z) Verified HD, intermediate desktop, Full HD, QHD, tablet, and phone sizes in the production browser; production build and documentation are complete.

## Surprises & Discoveries

- At QHD, About fills one 1440px section with portrait on the right and panels on the left. At 1280×720 the section is about 1029px high, with the status around 987px and lower panel rows offscreen.
- The 4096×2286 portrait uses `object-fit: cover` and `object-position: 100% 50%` inside the full mobile About height of about 1860px. This shows the far right of the asset rather than the face.
- At 390×844, the fixed mobile header overlaps experience rows while the user scrolls; the current mobile card rules center each label, value, and meter separately, leaving narrow islands of content.
- At 1440×900 the previous short-height breakpoint ended at 820px: panels reached about 974px and the section extended to 1055px. Fluid spacing now places the skills panel near 839px and the status near 880px inside a 900px section.
- A running development server kept serving an older CSS chunk after source edits and reload. A fresh `npm.cmd run build` followed by `npm.cmd run start -- --port 3000` showed the updated computed CSS and provided reliable visual checks.

## Decision Log

- Decision: Keep QHD composition, all content and animations, global design tokens, and the existing desktop section navigation. Adjust About-specific styles for HD and phone widths.
  Rationale: The requested repair is the second block; the QHD baseline works and the defect arises from the short-height and phone layouts.
  Date/Author: 2026-10-25, Codex.
- Decision: Let the home header scroll away with Hero through 1279px while keeping its initial appearance and links.
  Rationale: A fixed transparent header necessarily overlays rows in long phone and tablet sections.
  Date/Author: 2026-10-25, Codex.
- Decision: Keep the compact desktop layout fluid in viewport height and narrow its infographic at 1280–1535px.
  Rationale: A single 820px breakpoint created a visual jump at 1440×900, and the minimum 960px infographic width covered the portrait as desktop width narrowed.
  Date/Author: 2026-10-25, Codex.

## Outcomes & Retrospective

About fits one viewport at 1280×720 through 2560×1440 without panel overflow. The 1440×900 layout leaves the portrait visible beside the panels. Phone cards use the inner width, the portrait is visible in the opening viewport, and the long section scrolls without header overlap. The production build and TypeScript check pass. Unrelated working-tree changes were left intact.

## Context and Orientation

`components/About.tsx` renders `#about` with the `LiquidReveal` portrait, title, introduction, profile, experience, skills, and status. `app/globals.css` defines `.about-*` layout plus responsive rules. `components/Header.tsx` renders `.hero-home-header` as a fixed page header. The About section uses the 12-column site grid and shared Hero type tokens. The working tree already contains many unrelated changes; preserve them. The existing `components/SmoothSectionScroll.tsx` allows internal About scrolling when the section exceeds desktop viewport height. This repair should make HD fit without relying on that fallback.

## Plan of Work

First change the About-only `1280–1535px` short-height CSS in `app/globals.css`: reduce vertical spacing, panel padding, icon and row heights, and skill group gaps while preserving the text hierarchy. Scale the adjustments smoothly from 720px through 960px tall viewports and narrow the panels enough to leave the portrait visible. At 1536px and taller, remove unused status-row space on short screens. Verify the panel/status bottom is inside the viewport. Then change the phone rules: size the reveal layer to the opening viewport rather than the whole section, crop the face near the center, and organize card rows across the available width. The home header should use absolute positioning through 1279px so it appears in Hero but scrolls off before the About cards. Finally update `docs/sections/about.md` and `docs/design/responsive.md` to match the actual behavior.

## Concrete Steps

From `C:\Users\Dizfa\Desktop\Portfolio`, edit only the relevant selectors in `app/globals.css` and update the two documentation files. Run `npm.cmd run build`; expect a successful Next.js compile and TypeScript pass. Use the local development server at `http://localhost:3000/` to inspect `#about` at 2560×1440, 1920×1080, 1280×720, 390×844, 375×667, 360×780, and 320×568. At the small viewports, scroll through the profile, experience, skills, and status before Work.

## Validation and Acceptance

At QHD and Full HD, About retains the reference placement, portrait, three panels, and status without clipping or horizontal overflow. At 1280×720, the status and all panel rows appear within the section's visible frame, and the portrait is on the right. On phones, the face is visible in the opening About viewport, all card rows use the available inner width, no card extends beyond the page, and the header does not cover rows while scrolling. The reveal animation and reduced-motion presentation remain functional.

## Idempotence and Recovery

CSS and documentation edits can be repeated. Do not reset the working tree or delete assets. If a viewport fails, leave this plan active, record its measured geometry here, and revise only the relevant scoped rules. Keep the previous layout available in Git's existing diff for comparison without discarding other changes.

## Artifacts and Notes

Baseline browser measurements at 1280×720: About 1029px tall; title top 164px; profile panel 370–478px; experience and skills panels 498–959px; status bottom 987px. After compaction, About is 720px tall, the lower panels end near 665px, and status ends near 700px. On 390×844, the original About was about 1860px tall and the portrait box spanned that height; the repaired portrait box is one 844px viewport and the About section about 1626px. QHD screenshot shows the intended right portrait and left panel composition.

Final production measurements: at 1366×768, panels/status end at 711/748px; at 1440×900, 839/880px; at 1535×864, 807/844px; at 1536×864, both end at 824px; at 1920×1080, both end at 979px; at 2560×1440, both end at 1318px. At 320×568 and 390×844, panels have no horizontal overflow and the portrait layer is exactly one opening viewport tall. Scrolling through the phone and tablet cards reaches status before Work without a fixed header covering the content.

## Interfaces and Dependencies

No new package, route, or React interface is needed. Use the existing `About`, `LiquidReveal`, `Header`, and CSS custom properties. CSS-only edits should leave the canvas reveal's measured container and image crop aligned.

Revision note, 2026-10-25: Created after reproducing the user-reported HD and phone failures in the browser. Updated after discovering the 820px height breakpoint gap and stale development CSS; the implementation now uses fluid spacing and a fresh production preview for verification.
Revision note, 2026-10-25 17:49Z: Completed after the final 55vw infographic width check, target-size browser sweep, visual inspection, and successful production build.
Revision note, 2026-10-25: The user rejected the visual result because Full HD and HD did not match the 2K composition and the phone presentation was worse. Superseded by `2026-10-25-about-qhd-parity.md`; the earlier measurements remain as a record of that attempt.
