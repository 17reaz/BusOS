# BusOS Security Baseline

## Authentication
- Use Supabase Auth for user identity.
- Keep WhatsApp OTP delivery behind a server-side provider adapter. Cloud API credentials are secrets and must never be stored in browser/mobile source.
- Do not enable production OTP until provider credentials, template requirements, rate limits and abuse controls are configured.

## Authorization
- Enforce company and branch scope in PostgreSQL RLS.
- Use least-privilege role/permission checks.
- Treat UI route guards as UX only; they are not security boundaries.
- Service-role credentials may be used only in trusted server environments.

## Booking and payments
- Seat holds, booking confirmation, payment state and refunds require transactional server/database enforcement.
- Verify webhook signatures and provider event IDs.
- Use idempotency keys for all retryable payment/booking commands.
- Never trust a client-submitted amount, fare, payment status or seat availability.

## Data protection
- Minimize passenger PII; restrict access by job role.
- Do not log OTPs, access tokens, payment secrets or full sensitive passenger payloads.
- Define retention for GPS history, audit events and personal data.
- Keep secrets in environment configuration and document required variable names without committing values.

## Operational controls
- Record security-sensitive actions in an append-only audit trail.
- Rate-limit login, OTP, booking, seat-hold and public lookup endpoints.
- Validate uploads by type, size and ownership.
- Back up PostgreSQL and test restore procedures before production launch.
