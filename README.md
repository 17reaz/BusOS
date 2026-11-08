# BusOS

BusOS is a modular bus-company operations platform. It is being built as a **single repository with independently deployable applications** for administration, ticket counters, passengers, and fleet operations.

> Architecture status: foundation is being documented first. Existing applications remain in their current locations until a safe, tested migration is prepared.

## Applications

| Area | Current location | Responsibility | Status |
|---|---|---|---|
| Admin | repository root (`src/`) | Company setup, routes, schedules, trips, bookings, fleet, finance, reports, users | Existing Vite + React app |
| Passenger tickets | `tickets/` | Fast public trip search, seat selection, checkout, ticket lookup | Existing Next.js app |
| Counter / POS | planned: `apps/counter/` | Counter sales, cash sessions, receipts, refunds, offline queue | Planned |
| Fleet | planned: `apps/fleet/` | Driver/conductor workflows, trip assignment, GPS, inspections, offline sync | Planned Expo app |
| Backend services | planned: `services/` | API, booking orchestration, GPS ingestion, notifications, scheduled jobs | Planned |

## Technology direction

- **Web apps:** React + TypeScript + Vite for internal workspaces; Next.js for the public passenger experience.
- **Mobile:** Expo + React Native for Fleet.
- **Backend:** Bun + Hono services where server-side orchestration is required.
- **Data:** Supabase PostgreSQL, Auth, Realtime and Storage.
- **Offline:** IndexedDB for web counters and SQLite for Fleet, with explicit sync/outbox handling.
- **Validation:** Zod at API and form boundaries.
- **UI:** shadcn/ui within each app; no cross-app UI imports.

## Non-negotiable architecture rules

1. Each app owns its UI, routing, state, data access, environment variables and business workflows.
2. Apps do not import internal source code from another app.
3. Cross-app integration happens through documented HTTP APIs, database contracts, and events—not direct imports.
4. Financial records, operational records, and GPS/telemetry data have separate domain boundaries.
5. All company-owned data is tenant-scoped and protected by database RLS.
6. Booking and seat allocation must be concurrency-safe on the server/database; the browser is never the authority for seat availability.
7. Offline actions must be idempotent and auditable before they are synchronized.
8. Existing working features must not be removed during folder migration.

## Repository commands

Run the existing root app:

```bash
bun install
bun run dev
bun run lint
bun run typecheck
bun run build
```

Run the passenger app independently:

```bash
cd tickets
bun install
bun run dev
bun run build
```

## Documentation

Start with [Architecture](docs/ARCHITECTURE.md), then review [Modules](docs/MODULES.md), [Database domains](docs/DATABASE_SCHEMA.md), [API contracts](docs/API_DESIGN.md), [Security](docs/SECURITY.md), and the [Roadmap](docs/ROADMAP.md).
