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
