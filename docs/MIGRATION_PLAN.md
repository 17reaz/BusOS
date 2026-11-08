# Safe Repository Migration Plan

## Current state

- Repository root is the existing Vite + React + TypeScript Admin application.
- `tickets/` is an independent Next.js Passenger application.
- The existing root app and Passenger app must continue working while the repository evolves.

## Target state

- `apps/admin/`
- `apps/counter/`
- `apps/tickets/`
- `apps/fleet/`
- `services/api/`, `services/gps-ingestion/`, `services/notifications/`, `services/workers/`
- `infrastructure/supabase/` and `infrastructure/deployment/`

## Move strategy

### Move 1: Admin
1. Capture current root build, lint and typecheck baseline.
2. Inventory Vite aliases, PWA manifest/service-worker paths, public assets, env variables and deployment settings.
3. Move root app files to `apps/admin/` without changing application logic.
4. Update only path-dependent configs and scripts.
5. Run clean install, lint, typecheck, build and PWA smoke test.
6. Update Vercel project root only after verifying preview deployment.

### Move 2: Passenger
1. Capture `tickets/` build baseline.
2. Move `tickets/` to `apps/tickets/`.
3. Verify Next.js config, assets, environment variables, install scripts and deployment root.
4. Run a clean build and preview deployment.

### Move 3: New apps/services
Create Counter, Fleet and API as separate projects with their own package manifests, environment validation, build checks and deployment configuration.

## Safety rules

- One structural move per pull request.
- Never combine folder moves with feature rewrites or database schema changes.
- Do not delete `dev-dist/` until confirming it is generated output and the PWA build regenerates it.
- Keep lockfiles consistent with the selected package-manager/workspace strategy.
- Preserve existing deployment URLs and environment variable names unless a separately tested migration is approved.
- Keep a rollback commit and compare production/preview behavior before merging.
