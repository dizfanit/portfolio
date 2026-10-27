# Refine case image previews and hover feedback

This ExecPlan is maintained according to repository-root PLANS.md. Progress, discoveries, decisions and outcomes remain current throughout implementation.

## Purpose / Big Picture

Visitors can open case 007 (Abby), read full website images with smooth wheel scrolling, and close them into the exact original thumbnail without a gap. The image right edge follows the same inset as the close action. Close replaces the return action in the same position and disappears immediately when closing starts. Work cards and case materials have no idle outline and a complete red outline on hover or keyboard focus.

## Progress

- [x] (2026-10-06) Read existing instructions, dirty working tree, preview implementation, design tokens and motion documentation.
- [x] (2026-10-06) Implement stable preview geometry, action alignment, complete hover borders and local wheel smoothing; initial production build passed.
- [x] (2026-10-06) Verify QHD Abby pages, wheel interpolation, continuous close, drag, arrow/Escape/focus, Work hover and landscape inspection; final production build passed. Reduced-motion branches reviewed in code; browser preference emulation was not available in the used browser API.
- [x] (2026-10-06) Update motion/visual documentation and move plan registration to completed.

## Surprises & Discoveries

The original enlarged image relies on Motion shared layout across a native dialog, while its board source uses visibility:hidden until AnimatePresence completes. The close action is inside the exiting parent and remains visible during that exit. Its top uses safe-area tokens instead of the return action's case-content-top. Idle Work borders are red and hover is white, opposite the user's final instruction.

Observed QHD result: close and return rectangles are identical (top 202, height 50, right 2372). The expanded page frame measures left 188, right 2372, top 276, bottom 1416. After closing at scrollTop 2640, the close button is absent while the dialog stays open and its image opacity is 1; after completion dialog is closed, source opacity is 1 and focus is restored.

Wheel samples over successive 30ms intervals were 257, 616, 864, 1037, 1159, 1243: actual incremental movement, not a single native jump. Close samples showed widths 818.77, 629.69, 531.56, 477.52, 449.44, 436.20, 430.66, 428.89; preview opacity stayed 1 throughout, then source opacity became 1 as the dialog closed. After dragging, the destination still matched the thumbnail. Work idle border was transparent and hover rgb(209,10,10).

## Decision Log

Decision: Keep the native modal dialog but animate one persistent preview frame between measured board and grid bounds. Rationale: explicit coordinates avoid handing a disappearing shared element between different layers; focus trapping and Escape remain native. Date/author: 2026-10-06, Codex.

Decision: Smooth wheel input locally without changing touch or keyboard scrolling. Rationale: the requested effect belongs to website-image previews; no dependency or global scrolling change is needed. Date/author: 2026-10-06, Codex.

Decision: Center landscape inspection within the area below the shared action, rather than the whole viewport. Rationale: moving Close into the return-action slot would otherwise overlap the top of a large landscape image. QHD final landscape top is 342.01, below action bottom 252. Date/author: 2026-10-06, Codex.

## Outcomes & Retrospective

Implemented the requested case inspection fixes and Work feedback. Browser verification at 2560×1440 covered all four Abby images, long-page scrolling, arrows, Escape, return navigation, focus, drag and a landscape case (Atlanta Stroy). No runtime errors were captured. Final npm.cmd run build compiled, type-checked and generated all 17 pages successfully. Reduced motion and touch paths were reviewed in code; no mobile screenshot pass was performed, following docs/design/responsive.md. Existing unrelated uncommitted work is preserved. No commit or deployment was made.

## Context and Orientation

components/CaseStudyBoard.tsx renders project facts, draggable materials and a native dialog (a browser modal layer with focus trapping). components/CaseStudyBoard.module.css controls its grid bounds. hooks/useBoardPan.ts freezes canvas motion while inspection is present and is preserved. data/caseStudies.ts marks long website images with preview:"scroll". app/globals.css owns .work-board-art and its hover feedback, shared by components/WorkBoard.tsx. The common .board-dismiss action supplies existing typography. The case edge combines --hero-rail-x and --section-inner-inset. No global tokens, routes or case content change.

## Plan of Work

First replace shared image handoff in CaseStudyBoard with a locally scoped preview component whose frame remains mounted through opening and closing. Measure source and destination rectangles, animate geometry with the existing Motion dependency, and keep the source hidden until the frame reaches it. During close, convert native scroll position into an animated content offset returning to zero. Measure the return action position and width for the close action so both use the same slot, including compact layout. Add wheel smoothing with animation-frame cleanup, bounded destinations, native touch/keyboard behavior and reduced-motion bypass. Keep keyboard left/right switching and Escape.

Next use inset pseudo-element borders over case images so all edges stay above the image, transparent at rest and red on hover/focus. Change Work idle border to transparent and hover/focus to red. Update motion and visual documentation only with implemented facts. These steps are complete; landscape bounds additionally use the space below the action to avoid overlap.

## Concrete Steps

Work in C:\Users\Dizfa\Desktop\Portfolio. Apply scoped patches, then run npm.cmd run build. Reuse http://127.0.0.1:3000 for verification. Open /work/project-07 at 2560×1440. Read browser errors if behavior fails and repair the first broken interaction before proceeding. Build should report successful compilation and type checking.

## Validation and Acceptance

Open each Abby material and scroll a long page down and back up. The opened page and close action share the right inset. Close action occupies the return action's position; it disappears on activation. The image visibly reaches its source without vanishing and reappearing. Repeat closing at a deep scroll position and after dragging the board. Escape, arrow navigation and keyboard scroll remain usable, and focus returns to the selected thumbnail without moving the board. Inspect a landscape case as well. On /?section=work, idle cards have no visible border and hovered/focused cards have red borders. Check complete border edges and no horizontal overflow. Reduced motion remains immediate and native. Run the production build after TypeScript edits.

## Idempotence and Recovery

Edits are scoped to this task. Do not revert user changes or stop unrelated Node processes. Preview listeners, observers and animation frames clean up on close/unmount. No installation, external publication or commit is authorized. If interrupted, leave this plan active with the exact remaining checks.

## Artifacts and Notes

Baseline QHD return action: top 202px, right 2372px, width 281.20px; the prior close action used a different vertical token.

## Interfaces and Dependencies

Use installed React, next/image and framer-motion. Keep CaseStudyBoard({study}: {study: CaseStudy}) public interface and existing study schema. New preview/smooth-scroll implementation is private to case inspection. No backend or environment variables participate in this flow.

Revision note (2026-10-06): created after inspecting the implementation to capture the user's requested fixes and preserve unrelated work.

Revision note (2026-10-06): implemented persistent frame and wheel hook, recorded first build and QHD geometry/closing evidence; added resize measurement to keep the shared action slot aligned.

Revision note (2026-10-06): completed browser verification and final build, captured interpolation/return evidence, documented the landscape clearance adjustment and explicit verification limits, and completed plan registration.
