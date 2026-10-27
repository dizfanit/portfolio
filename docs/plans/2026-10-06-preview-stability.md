# Restore inspection actions and smooth case media

This living ExecPlan follows PLANS.md. Work in C:/Users/Dizfa/Desktop/Portfolio and preserve all existing uncommitted changes.

## Purpose / Big Picture

The Work close control must remain clearly visible above the edge shading. Cards must have no pale resting border and a red hover contour. Case return/close actions move slightly left along the existing grid; long pages use a centered 16:9 window, per the latest user instruction. In empty modal space a Close label follows the mouse and clicking anywhere there closes the photo. Work filters reappear immediately when closing starts. Image opening, scrolling and return must remain stable, with no missing frame when the dialog closes.

## Progress

- [x] (2026-10-06) Reproduced Work stacking and inspected case return lifecycle.
- [x] (2026-10-06) Prepared scoped component/style changes.
- [x] (2026-10-06) Applied changes and checked QHD interactions; build succeeded after component changes.
- [x] (2026-10-06) Recorded evidence and updated motion/visual documentation.

## Surprises & Discoveries

The Work close button is inside a backdrop with stacking level 10, beneath the viewport edge shading at level 30. Raising the button within that parent cannot escape its parent layer. A transparent physical border exposes the pale art background. Native dialog close removes its top layer before React restores the thumbnail, leaving a paint opportunity with neither visible.

## Decision Log

Move Work close into the viewport as a sibling above the edge shading, preserving the shading over the enlarged cover. Draw card borders as inset overlays without physical border width. Use half the existing grid gap as the small action inset. Case content gets one stable layout width, then scales using a motion value while the clipping frame changes size; this avoids repeatedly laying out tall images. Restore the thumbnail synchronously before closing the native dialog. Date/author: 2026-10-06, Codex.

## Outcomes & Retrospective

Implemented and verified at 2560x1440. Work Close is the top hit-tested button, cards have zero physical border and transparent resting contours. Filters were visible with opacity 1 and z-index 21 in the first closing sample while the cover was still returning. Case opening settles at unchanged bounds, scrolling is incremental, Close follows the mouse only on blank space, and image clicks do not close. A 95-sample close trace after scrolling had zero missing-source intervals; frame widths returned 1641, 986, 616, 486, 443, 430, 428 before source opacity became 1 as dialog closed. All four Abby images, arrow keys, Escape, blank click and a landscape image were exercised. Build compiled, type-checked and generated all 17 routes successfully. Final confirmation: landscape frame center is exactly (1280,720), with dimensions 1641.78125 x 923.984375 and top 258.0078125. Final build passed after this refinement. Screenshot saved in this task outputs/case-preview.png. No mobile/emulated reduced-motion browser pass, per responsive.md; those branches were reviewed. No deployment or commit requested.

## Context and Orientation

components/WorkBoard.tsx owns archive card inspection. app/globals.css owns its edge shading, card visuals and compact actions. components/CaseStudyBoard.tsx owns native dialog image inspection; its module stylesheet sizes the invisible destination rectangle and visible image frame. hooks/usePreviewScroll.ts smooths wheel movement only. Existing framer-motion and React suffice; add no packages.

## Plan of Work

First apply the button stacking, inset action edges and inset border overlays. Then change CaseMediaPreview to animate frame motion values while scaling an image at fixed layout width. Enable native/smoothed scrolling only once opening completes. Flush thumbnail restoration before dialog.close. Finally verify and document the observed result.

## Concrete Steps

From the project run npm.cmd run build. Existing dev server serves http://localhost:3000. Open /?section=work, inspect Abby, close and reopen, enter /work/project-07, inspect all four pages, scroll and close via button and Escape. Repeat the landscape case at /work/project-03. Inspect frame/source rectangles during return.

## Validation and Acceptance

At 2560x1440 the Work button is visible and clickable. Every card rests without a pale border, and the hovered card shows red on all sides. Return and Close share the same right edge; page inspection is 16:9 and centered. Empty space shows a mouse-following Close affordance, which disappears over the image; blank click closes, image click does not. Work filters show immediately at close start above the fading layer. Open image bounds remain stable at rest. Closing at the page top and after scrolling restores the source without any frame with neither source nor preview. Build must compile, type-check and generate routes successfully. Respect reduced motion in all new animations and clean up observers/animations.

## Idempotence and Recovery

Changes are staged with original file hashes. Apply only if those hashes still match; otherwise review intervening changes. No reset, file deletion or dependency changes. Repair only these scoped edits if build or browser checks fail.

## Artifacts and Notes

Before: close right 2364.5 versus Contacts box right 2357 at QHD; edge shading z-index 30, close trapped in layer 10. Browser evidence and build result to be appended after validation.

## Interfaces and Dependencies

Preserve public component props and useBoardPan/usePreviewScroll interfaces. CaseMediaPreview retains media, origin, open, reducedMotion, onClosed and onClose. Framer motion values hold frame coordinates/dimensions and image scale. react-dom flushSync is restricted to the final native-dialog handoff.

Revision note: initial plan and prepared implementation, 2026-10-06.
Revision note: user steering superseded right alignment with centered 16:9, requested mouse-following Close and immediate filters; implemented and validated these behaviors. Long page center is (1280,720), size 1642.65625 x 923.984375, top 258.0078125 below action bottom 234. A stale dev stylesheet survived reload after the production build; restarting only the identified Portfolio Next processes restored the current CSS. Final landscape bounds use the same symmetric action clearance.
