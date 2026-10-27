# Сохранить композицию About от 2K до HD

This ExecPlan is maintained according to `PLANS.md` at the repository root. Keep Progress, Surprises & Discoveries, Decision Log, and Outcomes & Retrospective current.

## Purpose / Big Picture

The second home section at 2560×1440 is the visual reference. At 1920×1080 and 1280×720, the entire arrangement of portrait, title, copy, panels, rails, and status should appear at the same relative coordinates and proportions. On phones, About should remain centered and readable through natural scrolling. The mobile Hero header gradient should cover the screen width without a visible rectangular edge. Open `http://localhost:3000/#about` to inspect the result.

## Progress

- [x] (2026-10-25) Read repository instructions, responsive guidance, current About and header styles, and inspected 2K, HD, and phone geometry.
- [x] (2026-10-25 18:14Z) Rebuilt About's 1280–2559px presentation from the unchanged 2K artboard and verified the stage geometry.
- [x] (2026-10-25 18:19Z) Faded the phone portrait before the cards, added experience-row spacing, and extended the mobile/tablet Hero header gradient to both screen edges.
- [x] (2026-10-25 18:23Z) Inspected 2K, Full HD, HD, 1440×900, four phone sizes, and tablet geometry; verified scrolling, no card overflow, the production build, and documentation.

## Surprises & Discoveries

- The current 2K infographic starts at x128/y641 and is 1120×677, while the HD version starts at x64/y308 and is 760×357. A true half-size reference would be x64/y321 and 560×339. Similar independent clamps shift the Full HD layout.
- The phone experience rows are 31px high and start at y745, 775, 806, and 836, leaving essentially no gap. The portrait remains bright behind the copy and profile.
- The home header's gradient pseudo-element was changed to absolute positioning for mobile scrolling, but its `inset-x-0` then limits it to the narrow header box. The supplied screenshot shows that rectangular edge.
- At 2K, wrapping the About contents in a stage did not move them: the title remains at x188/y353, infographic at x128/y641 with size 1120×677, and the section remains 2545×1440 in the browser's scrollable content area. The portrait canvas is also 2545×1440.
- At Full HD, the infographic is 840×508 at about x94/y481; at HD, 560×338 at about x60/y320. The few-pixel horizontal shift comes from centering the scaled 2545px artboard in the scrollbar-reduced viewport.
- At 1440×900, uniform width scaling leaves 45px dark margins above and below the artboard, preserving the 2K aspect ratio instead of stretching it.

## Decision Log

- Decision: Keep the current 2560×1440 About unchanged and render the same virtual composition at smaller desktop viewports, scaled uniformly within its section.
  Rationale: The requested result is visual parity, including relative positions and media crop; independent breakpoint rules cannot guarantee it.
  Date/Author: 2026-10-25, Codex.
- Decision: Keep the phone as a vertically scrolling composition, with stronger background fade and deliberate card row gaps.
  Rationale: Uniformly reducing a 2K canvas would make phone text unreadable and conflict with the mobile guidance.
  Date/Author: 2026-10-25, Codex.

## Outcomes & Retrospective

The 2K screenshot and measured bounds match the previous reference. Full HD and HD now use the same portrait crop, 12-column positions, and panel proportions at 0.75 and 0.5 scale. The mobile About has no horizontal panel overflow at 390, 375, 360, and 320px; experience rows have 16px gaps and the status remains reachable by native scrolling. The header gradient spans the available viewport width on phone and tablet. `npm.cmd run build` compiled and passed TypeScript; `git diff --check` found no whitespace errors. The existing unrelated working-tree edits remain untouched.

## Context and Orientation

`components/About.tsx` renders the section and its portrait reveal, title, copy, three cards, and status. `app/globals.css` contains all About styles and the media rules that currently distort the 2K composition. `components/Header.tsx` provides the home header gradient pseudo-element. The working tree contains many unrelated changes; preserve them. The 2K browser layout is the reference and should not move.

## Plan of Work

Introduce an About-only stage around the existing children. At widths from 1280px up to 2K, give this stage the 2K layout dimensions and local 2K design variables, then scale the stage uniformly to fit the actual viewport. At 2K, retain the current flow and geometry. Below 1280px retain a normal responsive layout. Refine only the phone About crop/fade and card spacing. Extend the header gradient pseudo-element to viewport edges while it scrolls with Hero on phone and tablet.

## Concrete Steps

Edit only `components/About.tsx`, About selectors and the home header gradient selectors in `app/globals.css`, and directly related documentation. Inspect QHD, Full HD, HD, intermediate desktop, tablet, and phone sizes in the local browser. Run `npm.cmd run build` after the component edit. Leave unrelated code and assets intact.

## Validation and Acceptance

At 1920×1080 and 1280×720, normalizing measured About coordinates by the viewport scale should closely match 2K. At 2560×1440, the previous appearance is unchanged. At 390×844, 375×667, 360×780, and 320×568, the copy and cards remain centered and readable, with no horizontal overflow or overlapping rows; status is reachable by scrolling. The header fade spans the mobile viewport without a hard vertical edge.

## Idempotence and Recovery

CSS and JSX changes are reversible through the task diff. Do not reset the working tree. If the scaled desktop stage clips text or changes 2K, adjust only stage rules and record the measured geometry here. Keep the previous About media rules visible until the replacement is verified.

## Artifacts and Notes

Baseline and final geometry and the user-provided header crop are recorded in Surprises & Discoveries. The local production preview was checked at 2560×1440, 1920×1080, 1440×900, 1280×720, 390×844, 375×667, 360×780, 320×568, and 768×1024. No new dependencies or routes were needed.

## Interfaces and Dependencies

The `#about` anchor remains on the section. `LiquidReveal` must stay inside the About stage so its image and canvas scale together. Desktop section navigation continues to use the outer section bounds; phone scrolling remains native.

Revision note, 2026-10-25: Created after the user rejected the previous adaptation and supplied the header screenshot.
Revision note, 2026-10-25 18:23Z: Completed after replacing independent desktop clamps with a uniformly scaled About stage, checking mobile readability and header bounds, and passing the production build.
Revision note, 2026-10-25: A follow-up mobile pass restored all four About frame corners, matched card width and typography to the Hero mobile tokens, and centered each card's contents. Checked 390, 375, 360, and 320px in the production browser; the 2K composition stayed unchanged.
