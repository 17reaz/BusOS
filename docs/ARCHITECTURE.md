# BusOS Architecture

## 1. Architecture decision

BusOS uses a **monorepo of independently deployable applications and services**. The repository is shared for version control and documentation; runtime boundaries remain explicit.

### Application boundaries

| Application | Target path | Runtime | Owns |
|---|---|---|---|
| Admin | `apps/admin/` | React + TypeScript + Vite | Internal administration and configuration |
| Counter | `apps/counter/` | React + TypeScript + Vite | Ticket sales, cashier sessions, counter hardware workflows |
| Passenger | `apps/tickets/` | Next.js | Public search, booking, passenger ticket access |
| Fleet | `apps/fleet/` | Expo + React Native | Driver/conductor app, GPS, inspections, offline work |

### Backend boundaries

- `services/api/`: Bun + Hono HTTP API and server-side use cases.
- `services/gps-ingestion/`: authenticated location ingestion and validation.
- `services/notifications/`: notification orchestration and delivery adapters.
- `services/workers/`: asynchronous jobs, reconciliation and scheduled work.

Do not create a service for every table. Split services when deployment, scaling, security, or operational ownership requires it.

## 2. Target repository layout

```text
BusOS/
├── apps/
│   ├── admin/                 # migrate current root Vite app here
│   ├── counter/               # new independent POS app
│   ├── tickets/               # migrate current tickets/ Next app here
│   └── fleet/                 # new Expo app
├── services/
│   ├── api/
│   ├── gps-ingestion/
│   ├── notifications/
│   └── workers/
├── infrastructure/
│   ├── supabase/
│   │   ├── migrations/
│   │   ├── seed/
│   │   └── tests/
│   └── deployment/
├── docs/
├── scripts/
├── .github/workflows/
└── package.json               # workspace orchestration only, later phase
```

This is the **target layout**, not an instruction to move existing code immediately. Current root `src/` remains the Admin app and current `tickets/` remains the Passenger app until migration checks pass.

## 3. Integration rules

- No imports such as `../../admin/src/...` from Counter, Tickets or Fleet.
- Each app has its own Supabase client and app-specific environment configuration.
- Prefer the backend API for privileged operations and cross-domain workflows.
- Apps may use the same database, but must respect RLS and documented schemas.
- Public clients must never receive service-role keys.
- Use versioned API contracts and stable identifiers.
- Realtime is for updates; critical writes still go through transactional database functions/API commands.

## 4. Data flow

```text
Admin ───────┐
Counter ─────┼── HTTPS API / Supabase RLS ── PostgreSQL
Tickets ─────┤                              ├─ Operational domain
Fleet ───────┘                              ├─ Financial domain
                                            ├─ Identity domain
Fleet GPS ── GPS ingestion ── location store└─ Telemetry domain
                                           
Postgres events / job queue ── workers ── notifications
```

## 5. Migration sequence

1. Document boundaries and preserve the existing root and `tickets/` apps.
2. Add CI checks for each existing app before moving anything.
3. Move root Admin to `apps/admin/` in a dedicated change; verify lockfile, PWA paths, aliases, deployment roots and build output.
4. Move Passenger app to `apps/tickets/` in a separate change; verify Next.js build and Vercel root directory.
5. Add Counter and Fleet as independent apps.
6. Add Bun + Hono API only when a real server-side use case is ready.
7. Introduce workspace scripts after all app package boundaries are tested.

## 6. Explicit non-goals

- No shared frontend component library across apps for now.
- No direct cross-app source imports.
- No microservices-per-table design.
- No Redis, Kafka or WebSocket infrastructure until measured load justifies it.
- No destructive database migration as part of a folder refactor.
