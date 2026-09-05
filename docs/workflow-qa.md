# Workflow QA

The live preview was inspected after the new features were integrated.

## Decision register

The Decisions tab renders a six-row demo register when the database has no persisted rows, clearly labels that state as DEMO REGISTER, and exposes owner, deadline, status, evidence status, approval outcome, rationale, and next action. The New decision form includes asset, owner, deadline, next action, and rationale fields. The selected-decision panel exposes status, approval outcome, and evidence-status controls. The server mutations are protected and persist to the decision register table when the user is authenticated.

## Evidence and incrementality

The Evidence tab renders separate upload surfaces for exposure, CRM, QR, and retail evidence and for treatment-control market observations. It shows source record counts, consented-link counts, required CSV columns, privacy guidance, and a waiting state when no observations exist. Market uploads require at least four rows and the server calculates a difference-in-differences estimate with a 2,000-resample bootstrap interval after all pre/post treatment/control cells are present.

## Validation

The browser preview shows both tabs without visible clipping in the desktop viewport. The final validation pass completed with 15 tests passing across 7 files, TypeScript passing, and the production build passing. External live feeds are not connected because no source credentials or API endpoints were supplied; the project now has a normalized protected ingestion layer ready for those connections.
