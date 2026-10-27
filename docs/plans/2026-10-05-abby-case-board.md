# Abby: interactive case board

This living ExecPlan follows PLANS.md. Update Progress, Surprises & Discoveries, Decision Log and Outcomes & Retrospective throughout implementation.

## Purpose / Big Picture

Replace only /work/project-07 with a visual project board. Visitors can drag and enlarge available work, read one information section at a time in a left-hand box, and return directly to /#work through client navigation. Other case routes retain their existing presentation.

## Progress

- [x] (2026-10-05) Inspected route, work board, design tokens and home navigation.
- [x] (2026-10-05) Created Abby content, isolated interactive page and return navigation.
- [x] (2026-10-05) Build passed; QHD composition, exclusive accordion, keyboard activation, image dialog, Escape/focus return and drag verified.
- [x] (2026-10-05) Return reached /#work with workTop=0 and no loading overlay; documentation updated.

## Surprises & Discoveries

The only confirmed project visual is public/abby-cover.png. Other newly present images are unrelated user work and must not be used without context. The homepage preloader mounts again on client return; prevent repeating a completed introduction within the same document session while preserving initial timing and appearance.

## Decision Log

Use a reusable client component with serializable case content, enabled only for project-07. Five accordion sections are About, Task, Problem, Solution and Visual system. Exactly one remains open. Native dialog provides focus containment, Escape and focus restoration. Use existing Next Link for client navigation and existing framer-motion and Next Image dependencies. Date/author: 2026-10-05, Codex.

## Outcomes & Retrospective

Delivered the Abby-only case board, actual supplied cover, five exclusive information sections and client return to the work archive. Build passed and desktop interactions were verified in the browser. Only one supplied material exists, so multi-image navigation is implemented but not exercised with real multiple assets. Mobile-specific visual testing was not run per the repository's QHD-first policy; the CSS stacks the information box and board on narrow screens. Other case templates remain unchanged.

## Context and Orientation

app/work/[slug]/page.tsx is the server-rendered route that resolves data/cases.ts and rejects unknown slugs. components/WorkBoard.tsx is the home archive. app/globals.css defines shared grid, color and typography tokens. app/page.tsx mounts components/Preloader.tsx. The board means a draggable image surface, not a new data dashboard.

## Plan of Work

Add data/caseStudies.ts containing Abby description, sections and a media array. Add components/CaseStudyBoard.tsx for the left information panel, right draggable media and enlarged native dialog. Add isolated case-study styles to globals.css using twelve desktop columns and existing typography tokens. Branch project-07 in the server route; keep static params and notFound. Update the brief Abby description in data/cases.ts. Make the preloader remember completion only in client module memory so initial document loads retain the current introduction.

## Milestones

First create content and page rendering; visiting /work/project-07 must display real Abby text and the supplied image, with no empty Screens or Results boxes. Next implement accordion and image controls; selecting Problem closes About, clicking an image enlarges it, and Escape closes it. Finally verify return to /#work without a new document or repeated introduction, then document observed results.

## Concrete Steps

From C:\Users\Dizfa\Desktop\Portfolio run npm.cmd run build. Expect compilation, TypeScript and all static routes to succeed. Run npm.cmd run dev -- --port 3000 if the server is not already running. If development styles remain stale after a build, identify and restart only this project's Next development process, without deleting caches or unrelated files.

## Validation and Acceptance

At 2560×1440, left panel and right board remain readable and separated, with no page horizontal overflow. Open each accordion with click and keyboard; exactly one aria-expanded is true. Open image, verify 16:9 and focus containment, close through button and Escape. Drag must not open media accidentally. Test top-right return and verify /#work plus no new document navigation. Direct project-07 loads work; another case retains its layout and unknown slug remains notFound. Mobile must retain reachable information and media controls.

## Idempotence and Recovery

All changes are additive or narrowly scoped. Preserve the dirty working tree and all existing assets. Retry failed builds after fixing only these changes; never reset or clean the repository. No commits or deployments are authorized.

## Artifacts and Notes

Build evidence: Compiled successfully; TypeScript finished; 17/17 static pages generated. Browser QHD evidence: innerWidth=2560, innerHeight=1440, horizontal overflow=false; left panel content/height=1133/1133; one aria-expanded=true. Problem switched to Solution through Enter. Native dialog closed through Escape and restored focus to the image trigger. Drag transform became translateX(-120px) translateY(-80px), dialogOpen=false. Return evidence: url=http://localhost:3000/#work, loading=false, workTop=0. Browser sandbox does not expose performance.timeOrigin, so document identity was not independently measured; navigation uses Next Link and no reloading overlay occurred.

## Interfaces and Dependencies

CaseStudyBoard receives plain strings and arrays for title, year, type, industry, sections and media. A media entry contains src, title, alt, width and height. Use React state for accordion and selected media; DOM access only in effects and event handlers. Existing Next 16, React 19 and framer-motion suffice; no dependencies to install.

Plan created 2026-10-05 to implement the user's approved accordion composition.

Updated 2026-10-05 after implementation and browser verification; recorded the single-image and mobile testing limits rather than presenting them as tested behavior.
