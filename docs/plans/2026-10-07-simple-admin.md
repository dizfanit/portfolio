# Simple local case administration

This ExecPlan follows PLANS.md in C:/Users/Dizfa/Desktop/Portfolio. Keep Progress, Surprises & Discoveries, Decision Log, and Outcomes & Retrospective current.

## Purpose / Big Picture

The owner opens /admin, chooses a password on the first local visit, adds a case with images and a category, and publishes it without editing code. The site displays it in the selected filter and opens its case page. This first iteration uses local persistent storage while hosting remains undecided.

## Progress

- [x] (2026-10-07) Read repository rules and relevant existing case flow.
- [ ] Implement persistent content, authentication and image APIs.
- [ ] Implement the admin form and connect public case routes.
- [ ] Build and verify authentication, draft/publish/edit, media and persistence.
- [ ] Verify UI at 2560×1440, document and hand over /admin.

## Surprises & Discoveries

Existing case categories are assigned by array index in components/WorkBoard.tsx, and app/work/[slug]/page.tsx resolves only static studies. Preserve all fourteen existing records and add separate server-provided records instead of migrating existing content.

## Decision Log

2026-10-07: use .portfolio-content outside public for JSON, password hash and uploaded media. User asked for a simple trial now; cloud storage depends on future hosting. Ignore this directory in Git and require backups. File storage supports one Node server with persistent disk, not arbitrary ephemeral deployment.

2026-10-07: first-password setup is allowed only from loopback during development; production requires the documented local setup script before startup. Store scrypt password hash and random HMAC session key, use signed expiring HttpOnly cookie, origin validation and login attempt limits. Drafts never appear in public lists/pages. Uploaded images get random names and are re-encoded with sharp, so paths cannot be supplied by clients.

## Outcomes & Retrospective

Implementation and validation pending. No existing content has been migrated or altered by this plan.

## Context and Orientation

app/page.tsx renders components/SelectedCases.tsx, which renders WorkBoard. data/cases.ts and data/caseStudies.ts contain static content. New data/adminTypes.ts contains browser-safe types; lib/content-store.ts and lib/admin-auth.ts contain server-only persistence and auth. app/api/admin routes handle login, case saves and uploads. app/media/[file]/route.ts serves sanitized image bytes. app/admin/page.tsx renders the new client form.

## Plan of Work

Add these modules, then load published cases in the server home page and pass them into SelectedCases and WorkBoard. Make the case route dynamic and resolve published local records before existing static studies. The new form supports create/edit, category, favorite flag, title/type/year/industry/description, six optional narrative sections, a cover plus ordered image list, draft/publish and logout. Existing built-in cases are listed as read-only. Number new cases after the existing maximum, and use immutable UUID slugs.

## Concrete Steps

Run the task's work/install-admin.cjs using node from the shared chat directory. Its writes are confined to C:/Users/Dizfa/Desktop/Portfolio. Run npm.cmd run build from that repository. Test against an isolated content directory using a production server on a spare port with a preconfigured test password; never set the user's real password during verification. Open the actual /admin in the in-app browser for first-time setup.

## Validation and Acceptance

Unauthenticated case/upload requests return 401. Incorrect login fails, missing/foreign mutation origins fail, and malformed media/cases are rejected. A valid upload records dimensions from decoded bytes. A saved draft has no public page. Publishing reveals the case in its selected category and /work/<slug>. Editing and returning to draft removes it again. Restart the isolated server and verify records remain. Inspect the admin at QHD and a compact screen because this new form must remain usable. Finish with npm.cmd run build passing.

## Idempotence and Recovery

Use atomic JSON replacement and a process-wide mutation queue, preserve unknown pre-existing files and content. Password setup uses exclusive creation. Test records belong only to the isolated test directory. The site remains usable when no new records exist. Back up .portfolio-content as a whole; do not delete it to reset normal content. No git commits or hosting deployment are authorized.

## Artifacts and Notes

Screenshots will be stored in this chat's outputs. Build and behavior evidence will be recorded here after verification.

## Interfaces and Dependencies

Use Node filesystem and crypto, Next route handlers and cookies, React, and sharp 0.34.5 already present in node_modules (declare it directly). No cloud account or new UI library is required. StoredCase records carry id/slug/number, status, category, favorite, cover and media objects with src/title/alt/width/height/kind, sections, timestamps and a revision for conflict detection. Store access is server-only and public callers receive only published records.

Revision note: initial plan for a local working first iteration, following the user's latest scope.

