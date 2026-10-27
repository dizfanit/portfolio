# Compact admin and editable site catalog

This living ExecPlan follows PLANS.md in the repository root. Keep Progress, Surprises & Discoveries, Decision Log and Outcomes & Retrospective current.

## Purpose / Big Picture

The owner can comfortably manage all portfolio works in /admin, including those originally defined in code. Published works appear in a common site list. A single-work checkbox removes the case-page link and disables internal images and detailed text. The Advertising banners category works in both the public filter and the editor.

## Progress

- [x] (2026-10-07) Read rules, current form, APIs, persistent storage and public data flow.
- [x] (2026-10-07) Delegate the advertising category to one explicitly requested subagent.
- [x] (2026-10-07) Implement built-in record overrides, common catalog and single-work persistence.
- [x] (2026-10-07) Implement compact editor, selection/status summary and disabled case details; replace media text fields with thumbnails and replacement/removal tools.
- [x] (2026-10-08) Build passed; all 56 isolated integration checks passed. UI replacement, removal, ordering, saving and reopening were verified; public banner filter shows the single-work preview without a case link.
- [x] (2026-10-08) Verify final gallery spacing at 2560×1440 and complete React review. Ten loaded images, readable 16px form text, visible saved publication status and reachable media controls were confirmed. No browser errors. Documentation updated; no separate FHD/mobile pass per repository responsive guidance.

## Surprises & Discoveries

Before this change the authenticated API returned only stored new cases. The sidebar's site list came directly from data/cases.ts and could not edit. WorkBoard had a separate source of static category and visual metadata. Public routes fell back to built-in cases even when a stored override was a draft. The merged catalog now resolves these mismatches and preserves the original visual metadata in shared data/workItems.ts.

The sandboxed Turbopack build stayed at “Creating an optimized production build”. After terminating only the confirmed task-owned build process, the same npm.cmd run build outside the sandbox succeeded in about six seconds. The main dev server was left running. Isolated tests reported ALL 56 CHECKS PASSED, and no browser errors were recorded during the gallery flow.

## Decision Log

2026-10-07: Keep original code and assets as defaults; save edited built-ins as overrides in existing version-1 local storage. Stable IDs identify built-ins and preserve slug and number. The common server catalog merges defaults and overrides; explicit drafts suppress the public default. Existing stored records without the singleWork flag default to false. Single-work media/text remain saved but inactive so toggling back restores them.

2026-10-07: Compact only AdminPanel.module.css, using smaller existing typography tokens and local spacing derived from grid gap. Do not modify global tokens, Hero, cursor, preloader or section order.

2026-10-07: The owner's follow-up removes editable per-image captions/descriptions. Keep generated accessible image labels internally; present only thumbnails, ordering, replacement/removal and the long-page checkbox in the editor. Original labels in existing case data remain unchanged and no visual caption is introduced.

## Outcomes & Retrospective

The merged catalog and full editor behavior are implemented and pass 56 integration checks on the final build. Browser testing confirmed a built-in gallery replacement, reordering and deletion persisted after reload, and that publishing a single banner showed it in both admin lists and under the public banner filter without a detail link. Final QHD screenshots show the compact editor, clear published status and ten thumbnail controls without image caption fields. Existing user records and unrelated source changes are preserved. No commit or deployment was performed. Smaller-width testing was not needed under the repository responsive guidance; the existing responsive layout and wrap behavior remain in place.

## Context and Orientation

components/AdminPanel.tsx renders the authenticated editor and lists; its CSS module controls only /admin. data/adminTypes.ts defines stored inputs and the public summary. lib/content-store.ts validates records, serializes writes and stores .portfolio-content/cases.json. app/api/admin/cases/route.ts exposes authenticated reads/writes. app/page.tsx passes summaries through SelectedCases to WorkBoard, which handles filters and preview links. app/work/[slug]/page.tsx renders detailed studies. data/workItems.ts will share unchanged built-in visual metadata; data/caseStudies.ts supplies original detailed text/media.

An override is a saved record with the same ID, slug and number as a built-in default. It replaces the default in the merged catalog without changing the TypeScript source. A single work is a cover with short preview text, without a detailed case route.

## Plan of Work

Share built-in Work metadata and build editable defaults using original study media and sections. Permit null covers only for original placeholders, and permit original media only when matching the same built-in's trusted assets. Continue validating uploaded media against stored dimensions. Merge overrides in authenticated and public reads, retaining revision checks and atomic file replacement. Expose singleWork in summaries and reject detail routes for single works and drafts.

Update the editor to load the common API catalog, show owner-created works separately and all published works in the site list, allow selection of each, and show saved status separately from pending status. Disable internal media and narrative with a nested fieldset when singleWork is checked. Reduce typography, controls, previews and spacing within the existing 12-column layout. Add integration assertions to scripts/check-admin.cjs, whose temporary storage protects actual owner content.

## Concrete Steps

Run commands in C:/Users/Dizfa/Desktop/Portfolio with PowerShell: npm.cmd run build, then npm.cmd run check:admin. Use the isolated test server on 3302 for disposable UI changes; npm.cmd run check:admin -- --keep-server retains it for visual checks. Do not replace or read the actual admin password file.

## Validation and Acceptance

An authenticated catalog includes all fourteen built-ins and saved new cases. Editing a built-in preserves slug and number and changes both the public preview and detail route. Drafting a built-in hides it and returns 404 for its route. Publishing a banner single work shows it under Advertising banners, with no case-page link and a 404 detail route. Reopening it shows Published clearly; detail controls are disabled and re-enable when unchecked. Revision conflicts still return 409. Reloading after restart retains edits. Existing media and original Malepartus/Abby layouts still work. Browser checks cover 2560×1440 for overflow and readable compact forms. Per docs/design/responsive.md, do not routinely open FHD/mobile views; add a smaller-width check only when a concrete regression or explicit user request warrants it.

## Idempotence and Recovery

No migration changes actual content files. Merging defaults on read is repeatable; saving creates or updates one override. Test fixtures use isolated temporary storage only. Restore only task-owned source edits if recovery is needed, preserving pre-existing work. Stop only a confirmed task-owned test process; leave the main local server available.

## Artifacts and Notes

Initial finding: the current GET /api/admin/cases calls readCases(), while the site sidebar maps cases imported from TypeScript. This explains the missing owner-added works in that list.

Final validation in PowerShell:

    npm.cmd run build
    Compiled successfully; TypeScript finished; all routes generated.
    npm.cmd run check:admin -- --keep-server
    ALL 56 CHECKS PASSED.

Browser evidence: a ten-image Malepartus gallery with no captions, replacement/removal/reorder controls; a saved test gallery reopened with nine images after replacement/removal; a single banner published via the UI displayed under the new public category without a case link. The retained test server is stopped after screenshots; the normal server remains at port 3000.

## Interfaces and Dependencies

Use existing React, Next.js, fs and image validation; no dependency additions. StoredCase gains singleWork and optional built-in origin information, with cover nullable for existing placeholders. readAdminCases() returns merged editable records; publishedCases() filters this catalog. WorkBoard receives the complete public catalog while preserving its original visuals for unchanged built-ins. New optional stored properties read with backward-compatible defaults.

Plan created 2026-10-07 to cover the explicitly requested admin expansion and delegated category. Updated during implementation for completed data/editor milestones and the owner's compact media gallery request. Completed 2026-10-08 with final build, integration and QHD evidence.
