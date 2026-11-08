# BusOS Current Repository Audit

Last reviewed: 2026-11-08
Default branch: `main`

This is a source-level audit of the files listed below. It is not a claim that CI or production behavior has been executed successfully.

## Current application layout

| Area | Actual location | Current state |
|---|---|---|
| Admin | repository root, especially `src/` | Vite + React + TypeScript demo workspace |
| Passenger | `tickets/` | Next.js demo booking flow |
| Counter | not created | planned independent POS application |
| Fleet | not created | planned Expo application |
| Backend services | not created | planned Bun + Hono services |

Do not move the root Admin app or `tickets/` until their separate build/deployment configurations are verified.

## Findings that affect implementation order

### Admin
- The dashboard and most page data/rendering logic currently live in `src/App.tsx`.
- Navigation includes Overview, Ticket sales, Trips & schedules, Routes, Passengers, Fleet, Finance and Live tracking.
- The records and dashboard metrics are hard-coded sample data.
- The create dialog is explicitly a demo simulation; only a local in-memory sample booking is added.
- Live tracking draws sample routes and advances markers through a local timer. It is not a live GPS feed.
- The current sidebar contains hard-coded company and owner identity.

**Next refactor:** extract the existing UI without changing behavior into feature folders (dashboard, bookings, trips, routes, passengers, fleet, finance and tracking), plus shared layout/navigation and table components. Keep demo fixtures clearly separated from future Supabase services.

### Passenger Tickets
- The app is a separate Next.js project under `tickets/` with its own package manifest and Bun lockfile.
- `tickets/app/page.tsx` contains the complete demo booking flow and its sample route/operator/seat/payment data.
- Payment options are labeled demo-only; the printed ticket also warns that it is not valid for travel.
- The demo seat availability is generated locally. It does not reserve seats in a shared database.
- The offline route is a Client Component and should be included in the Next.js build smoke test.

**Next refactor:** separate search/results, seat selection, passenger details, checkout and ticket presentation into components; then replace local data with a server-authoritative booking contract. Do not call a demo booking a confirmed real reservation.

### Build and repository configuration
- Root and Passenger apps each have their own `package.json` and `bun.lock`.
- Root Admin uses Vite 8, React 19 and TypeScript; Passenger uses Next.js 16 and React 19.
- Root PWA manifest previously carried generic Vite starter branding; it has now been updated to BusOS Admin.
- Passenger metadata previously carried Create Next App defaults; it has now been updated to BusOS Tickets.
- A GitHub Actions workflow now defines separate install, lint, type-check and build jobs for Admin and Passenger.

## CI expectations

The workflow is defined in `.github/workflows/ci.yml`. The first GitHub Actions run is the verification point. If a check fails, fix the actual failure before making structural moves; do not weaken or silently skip the check.

## Safe next implementation sequence

1. Confirm the new CI workflow passes for both existing applications.
2. Refactor Admin's monolithic `src/App.tsx` into feature modules without changing the demo UX.
3. Refactor Passenger's monolithic page into focused components without changing the booking demo.
4. Add tests and stable data contracts around trip search and seat allocation.
5. Design and implement transactional database booking/seat holds before connecting Counter or Passenger to live bookings.
6. Create Counter and Fleet as independent applications only when their initial workflows and deployment targets are ready.
7. Introduce Bun + Hono endpoints for privileged operations, payment webhooks, GPS ingestion and notifications.

## Production-readiness gaps

- No confirmed live Supabase integration for the shown demo datasets.
- No transactional seat locking or shared booking inventory.
- No payment provider integration or verified payment webhook flow.
- No real GPS device ingestion in the demo tracking map.
- No complete authentication, company membership, role/permission or RLS implementation evidenced by this source audit.
- No Counter or Fleet application exists yet.

These gaps are expected at the demo stage; they must be resolved before the system is used for real ticket sales or operations.
