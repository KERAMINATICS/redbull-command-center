# Project TODO

- [x] Upgrade the static project to the database-backed full-stack scaffold.
- [x] Define tables for channel metrics, sports activations, dashboard assumptions, and users.
- [x] Generate and apply the database migration safely.
- [x] Persist the existing clearly labeled simulated portfolio dataset.
- [x] Add server-side database helpers and typed tRPC query procedures.
- [x] Replace dashboard channel and activation collections with database-backed queries and safe fallback data.
- [x] Add a Vitest regression test for the dashboard persistence procedure.
- [x] Verify TypeScript compilation and automated tests.
- [x] Confirm current phase is read-only, portfolio-simulation data only, with no scheduled job or external ingestion enabled.
- [x] Document data provenance, disclosure boundaries, and access-control assumptions.
- [ ] Future phase: add user-authenticated admin editing only after permissions, audit logging, and editing UX are approved.
- [ ] Future phase: add scheduled public-data ingestion only after source, cadence, ownership, deployment, and data-quality requirements are confirmed.
