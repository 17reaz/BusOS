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


### First Admin extraction completed
- Extracted the navigation definitions, page configuration, table columns, demo datasets and sample tracking paths from `src/App.tsx` into `src/features/admin/data/demo-data.ts`.
- `src/App.tsx` now imports those fixtures instead of owning the full demo data block.
- This is a behavior-preserving structural step only; the data remains demo-only and the dashboard component still needs to be split into focused feature components.

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


## Admin implementation update

The Admin demo has now been reorganized into focused modules under `src/features/admin/`:

- `components/`: reusable KPI cards, module KPI grid, status badges, sortable data table and vehicle map.
- `dashboard/`: overview dashboard and revenue/booking channel widgets.
- `layout/`: responsive Admin sidebar.
- `data/`: clearly demo-only fixtures for each workspace module.
- `utils/`: reusable CSV export helper.

### Available Admin workspaces

Overview, Ticket sales, Trips & schedules, Routes, Passengers, Crew & staff, Fleet, Finance, Live tracking, Maintenance, Inventory, Counters, Users & roles, and Reports.

### Working demo interactions

- Navigate between all listed workspaces using desktop or mobile sidebar.
- Search visible records, filter by status, sort columns and paginate.
- Open a read-only record detail dialog.
- Export visible records to CSV (including Bengali text support via UTF-8 BOM).
- Add sample records in supported workspaces; new records update the current in-memory demo state.
- KPI cards, page labels and date context update with the selected workspace/current date.
- Notifications and help actions provide explicit demo feedback.

### Important limitations

All records, KPI totals, create actions and vehicle positions are still local demo data. New records are not persisted to Supabase or a server. Seat locking, payments, user permissions, GPS ingestion and financial ledger posting are not implemented by these UI interactions. Do not use the demo for real ticket sales or financial operations.

### Verification

GitHub source files were updated directly on `main`. The latest Vercel status checks reported a build-rate-limit failure for the linked projects, so a successful deployment/build has **not** been verified yet. Resolve the Vercel build quota/rate-limit and run Admin lint, typecheck and production build before treating this update as release-ready.
