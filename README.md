# UT Autos

Concierge mobile detailing for ultra-luxury cars and private jets. Customers browse a curated fleet (Ferrari, Lamborghini, Rolls-Royce, Bentley, Porsche, McLaren, Aston Martin, Mercedes-Maybach, and jets from Gulfstream, Bombardier, Cessna Citation, Embraer, Dassault Falcon), build a personal garage, book detailing services, and pay a 10% deposit to mobilize a detailer. Admin and detailer dashboards drive the booking lifecycle end to end.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Supabase** — Postgres, Auth, Row Level Security
- **Tailwind CSS v4** + Framer Motion
- Stripe / Paystack / PayPal / Apple Pay / Bank Transfer, each behind an `isConfigured()` feature flag with a working dev-mode fallback

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values (see below)
npm run dev
```

## Environment variables

See `.env.example` for the full list. At minimum you need:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — only used server-side in `app/api/webhooks/*` route handlers; never exposed to the client

Everything else (Stripe, Paystack, PayPal, Google Maps) is optional in development — leaving them as the `REPLACE_ME` placeholders keeps the app fully functional via dev-mode payment simulation and a manual-entry address form. Drop in real keys later and those flows switch to live automatically, no code changes required.

## Tests

```bash
npm test          # Vitest, runs in Node; no Supabase or payment keys needed
```

| Suite | Covers |
|---|---|
| `__tests__/api/paystack-webhook.test.ts` | HMAC-SHA512 signature check: valid, missing, wrong key, tampered body; ignored event types; 503 when unconfigured |
| `__tests__/api/stripe-webhook.test.ts` | Stripe signature verification path and `payment_intent.succeeded` handling |
| `__tests__/api/paypal-webhook.test.ts` | Every delivery verified with PayPal's `verify-webhook-signature` API; forged events rejected; only `PAYMENT.CAPTURE.COMPLETED` confirms a booking |
| `__tests__/webhook-helpers.test.ts` | Marking a deposit paid is idempotent under webhook retries and only confirms bookings still in `pending_payment` |
| `__tests__/pricing.test.ts` | Subtotal and 10% deposit calculation, including rounding |
| `__tests__/feature-flags.test.ts` | Placeholder keys keep each payment provider in dev mode |
| `__tests__/utils.test.ts` | Currency formatting, Tailwind class merging, body-style detection for vehicle silhouettes |

CI runs the tests, lint and a type-check on every push and pull request (`.github/workflows/ci.yml`).

The PayPal webhook needs `PAYPAL_WEBHOOK_ID` from the PayPal dashboard (see `.env.example`). Without it the route returns 503 instead of trusting unverified events.

## Database

All schema lives in `supabase/migrations/`, applied in order. Key design points:

- Every table has RLS enabled; customers only ever see their own garage/addresses/bookings/payments, admins see everything, detailers see only what's assigned to them.
- Two security-definer helpers (`private.is_admin()`, `private.is_detailer()`) back every policy — kept in a non-exposed `private` schema so they can't be called directly over PostgREST.
- The 10%-deposit-gates-detailer-mobilization rule is enforced at the database layer (a trigger blocks `detailer_assigned` before `confirmed`), not just in the UI.
- Garage vehicle removal is always a soft delete (`is_active=false` + `removed_reason`) — there is no DELETE policy on `garage_items`.

See [ERRORS_AND_FIXES.md](./ERRORS_AND_FIXES.md) for a log of issues hit during development and how they were resolved.

## Roles

Three roles: `customer`, `detailer`, `admin`, stored on `profiles.role`. New signups default to `customer`. Promote a user to `admin`/`detailer` with:

```sql
update public.profiles set role = 'admin' where id = '<user-id>';
```
