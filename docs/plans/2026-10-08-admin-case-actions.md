# Hide and delete cases from the admin editor

This ExecPlan is maintained according to `PLANS.md`. Progress, discoveries, decisions and outcomes are updated as the work proceeds.

## Purpose / Big Picture

The owner can select any saved case in `/admin` and immediately hide it from the public website, return it to the website, or delete it after confirmation. This works for both uploaded cases and the 14 original cases supplied by the source code. Hidden cases remain editable. Deleted cases disappear from the editor and website, including after a server restart.

## Progress

- [x] (2026-10-08) Read repository instructions, current editor, storage, route, isolated checks and responsive rules; preserve existing working-tree changes.
- [x] (2026-10-08) Implement protected state actions and persistent deletion markers with revision checks.
- [x] (2026-10-08) Add compact editor actions, hidden case list and native confirmation.
- [x] (2026-10-08) Extend isolated integration checks: production build passed and all 86 checks passed.
- [x] (2026-10-08) Verify visibility with unsaved form changes, deletion response, reload persistence and QHD layout; update user documentation.

## Surprises & Discoveries

Original cases are constructed at runtime and merged with stored overrides. Removing an override from `cases.json` would restore the original case instead of deleting it. The merged catalog must filter persistent deletion markers after applying overrides.

The first pipe-based test run ended prematurely after 17 successful checks without an error trace. A second run in a PTY completed all 86 checks. The isolated server had no leftover listener between runs.

The in-app browser did not expose the native deletion confirmation through `getJsDialog()`. Its click timed out, but the next authoritative page state showed the disposable case deleted, both counts reduced and the new editor empty. Reload confirmed persistence. Native cancellation was not separately observed; the implementation returns before any request when `window.confirm()` returns false.

## Decision Log

Decision: Hiding means setting the existing status to `draft`, through a small authenticated PATCH request. Rationale: public home and detail routes already consume the merged published catalog, and hiding should not save unrelated form changes. Date/author: 2026-10-08, Codex.

Decision: Keep deleted records with an internal `deleted` marker; do not expose them in the editor or publish them. Rationale: original cases must not return from source defaults, deleted identities must reject stale saves, and case numbers must not be reused. This is an internal persistence detail, not a user-facing trash or restore feature. Uploaded files are retained because they may be referenced elsewhere; this task does not delete media from disk. Date/author: 2026-10-08, Codex.

Decision: The selected saved case has explicit visibility and deletion buttons beside its saved status. Local unsaved form changes remain when visibility changes. Delete confirmation identifies the saved case by title and explains that it cannot be restored through the admin interface. Date/author: 2026-10-08, Codex.

## Outcomes & Retrospective

Both custom and original cases can be hidden, returned and deleted. Deleted original cases remain suppressed after restart, stale writes are rejected, and unsaved form edits survive visibility changes. The production build and 86 isolated checks passed. QHD browser inspection confirmed the actions fit and produce the expected saved status/list/editor updates; warnings and errors were absent. No real owner cases were hidden or deleted during development. Uploaded media are deliberately retained. Cancellation of the native confirmation was reviewed in code but was not separately observed in the in-app browser.

## Context and Orientation

The repository is `C:\Users\Dizfa\Desktop\Portfolio`, using Next.js App Router, React and TypeScript. `components/AdminPanel.tsx` renders the authenticated client editor. `components/AdminPanel.module.css` supplies compact token-based styles. `data/adminTypes.ts` defines the saved record and editable input. `app/api/admin/cases/route.ts` requires the admin session and same-origin writes. `lib/content-store.ts` merges 14 built-in cases with version 1 records in `.portfolio-content/cases.json`. An override is a saved record with the same stable ID as an original case. A revision is an integer that increases each save; stale requests are rejected with HTTP 409 to avoid overwriting another window's work. The public home and work routes use `publishedCases()`, so changes to the merged catalog control visibility throughout the site.

`scripts/check-admin.cjs` starts an isolated production server on port 3302 with a temporary storage directory and generated fixture credentials; it never edits the owner's account or catalog. `--keep-server` retains that fixture for browser inspection. The existing site on port 3000 should stay available.

## Plan of Work

The first milestone adds optional internal `deleted` metadata to StoredCase but excludes it from CaseInput. Filter deleted entries after merging defaults with stored records. Reject saving a deleted ID. Extract the existing atomic file write to a helper used by all mutations. Add `setCaseStatus(value)` and `deleteCase(value)` functions using the existing shared write queue, identity validation and revision checks. PATCH accepts `{id, revision, status}`; DELETE accepts `{id, revision}`. Both reuse admin authentication, origin enforcement, bounded request bodies and existing error responses. A deleted record is stored with status draft and a new revision.

The second milestone adds Hide/Return to website and Delete buttons to the selected case summary. Visibility updates the saved list immediately and the draft's status/revision without discarding other edits. Delete requires a native confirmation with the case title and then removes it from both lists and resets the editor only on success. Every saved draft appears in a dedicated hidden-case disclosure; custom drafts also remain in the owner's list. Disable mutations while saving or uploading, and display API failures through the existing error region. Use scoped CSS and existing typography tokens.

The final milestone extends the isolated script with authentication/origin checks for both new methods, first-time built-in hiding, restored content equality, custom hiding, deletion of published and hidden cases, stale deletion rejection, refusal to save or republish deleted identities, and persistence after restart. The script deletes extra fixtures and original project-03, retains gallery cases and leaves project-02 hidden for browser inspection. The browser walkthrough additionally deleted the disposable main custom fixture after its hide/return flow. Update `docs/admin.md` and `ARCHITECTURE.md` with actual behavior.

## Concrete Steps

Run from `C:\Users\Dizfa\Desktop\Portfolio`:

    npm.cmd run build
    npm.cmd run check:admin -- --keep-server
    git diff --check

The build must finish successfully, including TypeScript. The integration script prints `ALL 86 CHECKS PASSED.` Inspect `/admin` on the isolated server at a 2560×1440 viewport. Log in only with the fixture password defined in the script. Hide and return a fixture case, verify its saved status and list membership, then reload after deletion to verify persistence. The in-app automation did not expose the native confirmation; cancellation was reviewed in code rather than observed. Stop only the isolated test server afterward.

## Validation and Acceptance

For an original case with revision zero, hiding removes it from the public home and its detail URL returns 404; the admin still lists it as hidden. Returning it preserves metadata, gallery, stable number and URL. The same flow works for uploaded cases. Deleting removes the case from every admin list and public route. Restarting must not resurrect a deleted original or uploaded case. Saving, publishing or deleting an already-deleted identity must return 404; an old revision on a still-existing identity must return 409. Unauthenticated and foreign-origin mutations must fail. In the browser, unsaved title changes survive visibility toggles, the delete dialog names the selected case, cancellation changes nothing, and accepted deletion resets the editor. New actions remain readable, reachable and without overlap or horizontal overflow at QHD.

## Idempotence and Recovery

The checks create a new disposable storage directory each run. Never point them to `.portfolio-content` or copy the owner's credentials into tests. Visibility can be reversed through the editor. Delete cannot be reversed through the editor; persistent records remain only for suppressing defaults and manual recovery from a backup. Atomic rename and the shared write queue prevent partial JSON writes within the current single-server design. If the browser verification fails, fix that boundary before continuing, rebuild after source changes, and rerun only justified checks. Do not delete uploaded files, existing logs or unrelated assets.

## Artifacts and Notes

Terminal evidence:

    npm.cmd run build
    Compiled successfully; Finished TypeScript; all App Router routes generated.

    node scripts/check-admin.cjs --keep-server
    ALL 86 CHECKS PASSED.

Browser evidence: the custom fixture status became `Черновик · скрыт с сайта`, the public count fell from 14 to 13, and the title field retained `Тест админки — несохранённая правка`. Return restored publication. Deletion showed `Кейс «Тест админки» удалён.`, removed the custom item and reset the form. Reload kept it removed. A native QHD screenshot is stored at `C:\Users\Dizfa\.codex\visualizations\2026\10\07\01a1184f-d326-7ef0-a9fd-cfaafcf4f2d1\admin-case-actions-qhd.png`. The actions are 42px tall and inside the editor; document scrollWidth equals clientWidth (2545px excluding the scrollbar). Browser warning/error logs returned an empty list.

## Interfaces and Dependencies

Use existing React state, fetch, native `window.confirm`, Web Request/Response, `fs/promises`, randomUUID and ContentError. Add no dependencies. `StoredCase.deleted?: boolean` is internal persisted metadata. `readAdminCases(): Promise<StoredCase[]>` excludes deleted records. `setCaseStatus(value: unknown)` and `deleteCase(value: unknown)` return the saved record after validation. DELETE responds with `{id}`; PATCH responds with the full saved record.

Revision note (2026-10-08): Initial plan records storage implementation and the remaining editor/check milestones, with explicit original-case deletion semantics.

Revision note (2026-10-08): Completed implementation, production build, 86 checks and QHD walkthrough; recorded the native-confirmation observation limit and actual fixture outcomes.
