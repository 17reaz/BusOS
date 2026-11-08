# BusOS API and Integration Contracts

## Principles

- Use Bun + Hono for server-side endpoints when privileged orchestration, provider secrets, validation or multi-step transactions are required.
- Keep request/response contracts versioned under `/api/v1`.
- Validate all input with Zod at the boundary.
- Authenticate every private endpoint and authorize company/branch scope on the server.
- Use stable IDs; do not expose sequential database IDs as authorization tokens.
- Return consistent error codes and request IDs.

## Initial endpoint map (proposed)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/trips` | Search published trips |
| GET | `/api/v1/trips/:tripId/seats` | Read current seat availability |
| POST | `/api/v1/seat-holds` | Atomically hold requested seats |
| POST | `/api/v1/bookings` | Create booking against valid hold |
| GET | `/api/v1/bookings/:reference` | Authorized ticket lookup |
| POST | `/api/v1/payments/intents` | Create provider payment intent |
| POST | `/api/v1/webhooks/payments/:provider` | Verify provider callback |
| POST | `/api/v1/fleet/locations` | Ingest authenticated GPS batch |
| POST | `/api/v1/trips/:tripId/events` | Record dispatch/driver event |

These endpoints are design contracts only; do not assume they already exist.

## Seat hold contract

1. Client requests trip + seat IDs with an idempotency key.
2. Server/database transaction verifies trip is sellable and seats are free.
3. Transaction creates expiring holds and returns hold ID + expiry.
4. Booking confirmation consumes a valid hold atomically.
5. Expired holds are released by transaction/cleanup job.
6. Realtime broadcasts changes, but the transactional database remains authoritative.

## Offline command contract

Every offline-capable mutation includes:
- globally unique `client_command_id`
- authenticated actor and device identity
- entity ID and expected version where relevant
- client event timestamp and server received timestamp
- retry-safe payload

Server stores command result and returns the same result for duplicate IDs. Conflicts must be surfaced; never silently overwrite newer financial or booking data.

## Realtime

Use Supabase Realtime for low-latency UI updates such as seat state and vehicle latest location. Realtime messages are hints to refresh authoritative data, not proof that a booking or payment succeeded.
