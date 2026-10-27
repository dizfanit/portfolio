# Compact shared actions and repair Work preview closing

This living ExecPlan follows PLANS.md at the repository root. Its progress, discoveries, decisions and outcomes are maintained during work.

## Purpose / Big Picture

The close actions in Work and case images, and the return-to-Work action in a case, become approximately 1.5 times smaller. Close in a case keeps the return action's top/right alignment but uses its own natural text width. A Work cover remains visible throughout its return to the source card, while a uniform inspection shade fades into the existing board shade without a lingering second edge gradient. The user additionally requested a 16:9 visible area for opened scrollable website images: constrain this viewport by available height and grid width, keep its right edge aligned with Close, and retain the full page inside for scrolling.

## Progress

- [x] (2026-10-06) Inspect instructions, dirty tree, shared actions, Work shared layout and both perimeter gradients.
- [x] (2026-10-06) Implement compact actions and persistent Work cover return; first production build passed.
- [x] (2026-10-06) Add the user's follow-up: scrollable website inspection uses a 16:9 visible viewport bounded by the grid and available height.
- [x] (2026-10-06) Final production build passed; QHD button geometry, website scrolling, Work close/Escape, shifted-board return, focus and full-case navigation verified.
- [x] (2026-10-06) Update motion/design documentation and complete registration.

## Surprises & Discoveries

Work hides the board cover with visibility:hidden until AnimatePresence removes the departing layoutId cover. The overlay also applies board-edge-shade::before, whose gradient does not fade with the backgroundColor and therefore disappears separately. In a case the close action inherits the measured return-action width, making a short label unnecessarily wide.

The child's layout effect can run before an ancestor ref attaches. Measuring the positioned overlay through the frame's own attached ref and closest DOM ancestor fixes the initially stuck thumbnail. The existing development process also served stale styles after builds; restarting only this repository's dev process restored current output. A semantic browser click caused test-only auto-scrolling on the shifted board; coordinate clicks confirmed a stable scrollY of 2880 and an exact return to source top 131.671875px without that artifact.

## Decision Log

Decision: Use one persistent Work cover frame with measured board and target coordinates, as in case image inspection. Rationale: removing shared-layout crossfade keeps a visible cover until the exact source bounds are reached. Date/author: 2026-10-06, Codex.

Decision: Keep only the stationary board edge shade and animate a separate uniform inspection layer by opacity. Rationale: no extra edge gradient remains after the inspection background fades. Date/author: 2026-10-06, Codex.

## Outcomes & Retrospective

Completed. All three actions use a 32px minimum height, approximately 1.5 times smaller than the previous 50px buttons. In case 007, Return and Close share top 202px/right 2372px/height 32px; their natural widths are 197.89px and 105.38px. The scrollable website viewport measured 2058.66×1157.98px (16:9 within subpixel rounding), retains full-page scrolling and displays the complete header/hero. Work return samples kept the moving cover at opacity 1 until the source became visible, reached exact source bounds, and removed Close immediately. The single uniform shade continuously faded to zero; no duplicate perimeter gradient remained. Landscape and square covers, Escape, restored focus, board movement and full-case navigation passed at 2560×1440. Reduced-motion branches were reviewed in code, not browser-emulated; mobile was not separately tested per the repository's responsive workflow. Existing unrelated changes are preserved; no commit or publication was requested.

## Context and Orientation

components/WorkBoard.tsx owns Work covers and the opened project summary. .work-* rules in app/globals.css control its composition and .board-dismiss styles all three actions. components/CaseStudyBoard.tsx measures the return action for the close action; remove only width from that measured style. The installed React and framer-motion dependencies are sufficient. A frame means the single element holding the animated cover. Coordinates must be relative to its positioned overlay so page scrolling does not offset the return.

## Plan of Work

Reduce .board-dismiss text, padding, gap and minimum height using the existing eyebrow token scaled for this explicit size request. Keep natural width on both Close actions. In WorkBoard, retain previewSlug until closing ends and separate open state from presence. Replace shared layout on covers with a persistent frame moving between source art and the detail-visual placeholder. Fade shade and copy independently; remove Close immediately on close. Keep drag disabled and source cover hidden until frame completion, then restore focus. Keep route links, category filtering, board geometry, cursor behavior and case data unchanged.

## Concrete Steps

In C:\Users\Dizfa\Desktop\Portfolio edit with scoped patches, run npm.cmd run build and reuse http://127.0.0.1:3000. Open /?section=work at 2560×1440, inspect a real landscape cover and a square placeholder, then close by button and Escape. Enter /work/project-07 and check return/close sizing and page alignment. Compilation and TypeScript must pass.

## Validation and Acceptance

Desktop action heights decrease from about 50 to about 33 pixels; close is naturally narrower than the return label but both have the same height/style/top/right alignment inside a case. Sample Work close frames: the moving cover stays opacity 1 until its source takes over with no empty sample. Only the stationary board perimeter remains, and inspection shade opacity continuously reaches zero before removal. Check closing after drag, Escape, focus and navigation to a full case. Reuse QHD only per docs/design/responsive.md; reduced-motion branches can be inspected if browser emulation is unavailable.

## Idempotence and Recovery

No dependency installation, destructive command or deployment is required. Clean up resize observers and animation callbacks on unmount. Preserve unrelated modifications. If interrupted, leave remaining checks documented and this plan active.

## Artifacts and Notes

Baseline case action measures top 202px, height 50px, right 2372px and width 281.20px at QHD. These are evidence, not new global tokens.

Final build: npm.cmd run build passed compilation, TypeScript and generation of all 17 pages. Dev server remains available at http://127.0.0.1:3000.

## Interfaces and Dependencies

Keep WorkBoard() and CaseStudyBoard({study}) public interfaces. The new private Work cover component receives WorkItem, originating button, open/reduced-motion booleans, destination ref and a completion callback. Its own frame ref resolves the positioned overlay. Use motion.div and measured rectangles; no shared layoutId is necessary for Work covers after this change. components/CaseStudyBoard.module.css .pageBounds defines the 16:9 website viewport; source image dimensions remain untouched.

Revision note (2026-10-06): created to record requested compact actions and Work return/shade correction.

Revision note (2026-10-06): implemented compact actions and Work return, and incorporated the user's additional 16:9 website inspection request while retaining the original objective.

Revision note (2026-10-06): completed implementation, final build and QHD interaction checks; recorded actual geometry and test limitations.
