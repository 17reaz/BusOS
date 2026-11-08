# BusOS Roadmap

## Phase 1 — Architecture foundation
- [x] Document monorepo and app boundaries
- [x] Define target folder layout and safe migration sequence
- [x] Define module map, data domains, API principles and security baseline
- [ ] Review current app structure and record migration-specific paths
- [ ] Add CI checks before moving app folders

## Phase 2 — Admin and Counter foundation
- [ ] Modularize Admin routes/features without changing behavior
- [ ] Add role/permission model and company/branch context
- [ ] Define Counter POS flows and receipt/print requirements
- [ ] Implement counter sales against the same transactional booking core

## Phase 3 — Operational backend
- [ ] Supabase migrations, RLS and seed data
- [ ] Routes, schedules, trips, vehicle and crew assignments
- [ ] Seat layout, seat hold, booking and cancellation transactions
- [ ] Audit events and idempotency

## Phase 4 — Passenger booking
- [ ] Trip search and live seat map
- [ ] Seat hold countdown and booking creation
- [ ] Payment provider adapter and verified webhooks
- [ ] Ticket lookup, cancellation and refund flow

## Phase 5 — Fleet operations
- [ ] Expo app shell and driver/conductor auth
- [ ] Trip manifest and dispatch actions
- [ ] GPS ingestion, latest-location view and history retention
- [ ] Offline command queue, retry and conflict handling
- [ ] Vehicle inspection and incident reports

## Phase 6 — Business expansion
- [ ] Finance ledger and reconciliation
- [ ] Vehicle maintenance, fuel and inventory
- [ ] Crew attendance and payroll
- [ ] Multi-company support, advanced reporting and analytics

## Release gates

Do not move to the next production phase until the current phase has:
- typecheck/lint/build passing for affected apps
- RLS and authorization tests for affected data
- documented migration and rollback plan
- manual workflow verification for critical paths
