# BusOS Modules

## Product areas

### 1. Admin
- Overview dashboard and operational KPIs
- Company, branch and counter setup
- Routes, stops, schedules, trips and fare rules
- Bus/vehicle and crew registry
- Booking and ticket oversight
- Live operations and trip dispatch
- Finance, cashbook, payment reconciliation and refunds
- Maintenance, inventory and fuel records
- User roles, permissions and audit trail
- Reports, exports and notification templates

### 2. Counter / POS
- Staff sign-in and counter/branch context
- Trip search and seat map
- Server-authoritative seat hold and booking
- Cash/card/mobile-payment recording
- Thermal receipt and ticket printing
- Reprint, cancellation and refund workflows with permissions
- Cash drawer opening/closing and shift reconciliation
- Network interruption queue with idempotent retry
- Daily counter sales report

### 3. Passenger Tickets
- Search by origin, destination and travel date
- Live trip and seat availability
- Passenger details and contact verification
- Temporary seat hold with expiry
- Checkout and payment status
- Booking confirmation, ticket view and lookup
- Cancellation/refund policy display
- Accessible, mobile-first, low-latency interface

### 4. Fleet
- Driver/conductor authentication
- Assigned trips and manifest
- Start, checkpoint, delay and complete trip actions
- GPS tracking with permission and battery-aware sampling
- Offline trip actions and later synchronization
- Vehicle pre-trip inspection and defect report
- Incident and breakdown reporting
- Push notifications for dispatch changes

### 5. Backend and platform
- Authentication/authorization policy enforcement
- Booking and seat-lock orchestration
- Payment provider adapters and webhook verification
- GPS ingestion and latest-location projection
- Notification delivery and retry
- Scheduled cleanup and reconciliation jobs
- Audit events and operational monitoring

## Suggested role model

Start with scoped permissions rather than hard-coded page visibility:
- Platform owner
- Company owner
- Company administrator
- Operations manager
- Counter manager
- Counter agent
- Dispatcher
- Driver
- Conductor
- Finance officer
- Auditor / read-only

Every permission must be checked server-side or by database RLS—not only in the UI.

## Delivery priority

Build in this order: reliable trip/seat/booking core → counter sales → passenger checkout → finance reconciliation → fleet/GPS → maintenance, inventory and advanced HR/payroll.
