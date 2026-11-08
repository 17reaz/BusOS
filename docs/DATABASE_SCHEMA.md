# BusOS Database Domains

This document defines logical boundaries, not a final SQL migration. Confirm each table, constraint and index against real workflows before creating migrations.

## 1. Identity and organization
Suggested entities:
- `companies`, `branches`, `counters`
- `profiles`, `company_memberships`, `roles`, `permissions`
- `audit_events`

Company-owned records carry `company_id`; branch-scoped records may also carry `branch_id`. Use foreign keys and RLS policies that verify membership and permission scope.

## 2. Operational domain
Suggested entities:
- `stations`, `routes`, `route_stops`
- `vehicles`, `crew_members`
- `schedules`, `trips`, `trip_assignments`
- `seat_layouts`, `trip_seats`, `seat_holds`
- `passengers`, `bookings`, `booking_passengers`, `tickets`
- `cancellations`

A trip is a dated operational instance; a route is a reusable path. A seat hold must have an expiry and a server-enforced uniqueness/concurrency rule. Booking state transitions must be explicit.

## 3. Financial domain
Suggested entities:
- `payment_intents`, `payments`, `payment_attempts`
- `refunds`, `cash_sessions`, `cash_movements`
- `ledger_accounts`, `journal_entries`, `journal_lines`
- `counter_settlements`

Never treat a mutable booking status or a single amount column as the financial ledger. Financial events should be append-only or corrected with reversal entries. Verify payment webhooks and make provider events idempotent.

## 4. GPS and telemetry domain
Suggested entities:
- `fleet_devices`, `vehicle_locations`, `vehicle_status_events`
- `vehicle_sensor_events` (only when actual sensors exist)
- `trip_tracking_sessions`

Store timestamp, device identity, vehicle/trip association, coordinates, accuracy and source. Keep high-volume location history separate from transactional booking queries; define retention and aggregation policies before production scale.

## 5. Platform rules

- UUID primary keys; timestamps stored in UTC.
- Use explicit status enums/check constraints and documented state transitions.
- Add indexes for company, trip/date, route, booking reference and status-based operational queries.
- Use unique constraints to protect booking references, payment provider references and active seat allocation.
- Keep raw webhook/event payload access restricted and redact personal data in logs.
- Use database transactions or Postgres RPC for seat holds, booking confirmation, refunds and ledger posting.
- Do not create tables solely because they appear in this proposal. Add them when a workflow is being implemented.

## 6. Initial migration order

1. Identity/company membership and RLS foundations.
2. Stations, routes, vehicles, schedules and trips.
3. Seat layouts, trip seats, holds and bookings.
4. Payments, cash sessions and ledger posting.
5. Crew assignments, trip events and GPS.
6. Maintenance, inventory, payroll and analytics.
