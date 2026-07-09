# Errors & Fixes Log — UT Autos

Log of every real error hit while building this platform and how it was resolved. Kept for future sessions on this project.

## 1. Next.js 16 renamed `middleware.ts` → `proxy.ts`

**Error:** Dev server warned `The "middleware" file convention is deprecated. Please use "proxy" instead`, then hard-failed with `The file "./proxy.ts" must export a function, either as a default export or as a named "proxy" export.`

**Fix:** Renamed `middleware.ts` → `proxy.ts` at the repo root and renamed the exported function from `middleware` to `proxy`. The `config.matcher` export is unchanged. This is a Next.js 16 breaking change, not something flagged in older docs/training data.

## 2. `permission denied for schema private`

**Error:** `createDraftBooking` (and other actions) intermittently failed with `{"ok":false,"error":"permission denied for schema private"}`, even though the same RLS-policy pattern (`... or private.is_admin()`) appeared to work fine elsewhere.

**Root cause:** The `private` schema (holding `is_admin()`/`is_detailer()` helpers, created in migration `0003_security_hardening`) never had `GRANT USAGE ON SCHEMA private` issued to `authenticated`/`anon`. Function-level `GRANT EXECUTE` was set, but schema-level `USAGE` was missing. Queries only failed once something actually forced evaluation of the `private.*` branch (e.g. a trigger unconditionally referencing it); queries where an earlier `OR` clause satisfied the row filter first didn't visibly fail.

**Fix:** `grant usage on schema private to authenticated, anon;` (migration `0012`).

## 3. `confirm_dev_payment` NULL-bypass vulnerability

**Error:** None observed in the app — caught during the security audit pass, not by a runtime failure.

**Root cause:** `confirm_dev_payment` is `SECURITY DEFINER` (bypasses RLS on `bookings`/`payments` entirely, running as the function owner). Its ownership check was `if v_booking.customer_id <> auth.uid() then raise exception`. When `auth.uid()` is `NULL` (unauthenticated/anon caller), `<>` against `NULL` evaluates to `NULL`, and `IF NULL THEN` is treated as `false` in PL/pgSQL — so the guard silently never fires for an anonymous caller.

**Fix:** Migration `0014` rewrote the check to explicitly reject when `auth.uid() is null`, used `IS DISTINCT FROM` instead of `<>` (NULL-safe comparison), and revoked the default PUBLIC `EXECUTE` grant, re-granting only to `authenticated`.

## 4. RLS `UPDATE` policies missing explicit `WITH CHECK`

**Error:** Detailer clicking "Mark Completed" (last stage of a job) silently did nothing — no error, but `bookings.status` never left `in_progress`. Same latent bug existed in the customer's booking-cancellation path.

**Root cause:** `bookings_update_detailer` and `bookings_update_customer` were defined with only a `USING` clause (e.g. `status in ('detailer_assigned','en_route','in_progress')`). Postgres defaults an `UPDATE` policy's `WITH CHECK` to the same expression as `USING` when none is given. That means the **new** row also had to satisfy `status in (...)` — which is false for the terminal `completed`/`cancelled` transition, so the `UPDATE` matched 0 rows and returned success with no changes.

**Fix:** Migrations `0016`/`0017` added explicit `WITH CHECK (detailer_id = auth.uid())` / `WITH CHECK (customer_id = auth.uid())` — ownership only, since the actual transition whitelist is separately enforced by the `enforce_booking_status_transition` trigger.

## 5. Next.js route groups don't add a URL prefix

**Error:** Build error: `You cannot have two parallel pages that resolve to the same path. Please check /(admin)/bookings/[id] and /(customer).`

**Root cause:** `app/(admin)/...` and `app/(detailer)/...` were created as route groups (parens), which are organizational only and contribute nothing to the URL. `(admin)/bookings/[id]/page.tsx` therefore resolved to `/bookings/[id]` — the exact same path already used by `(customer)/bookings/[id]/page.tsx`. It also meant admin/detailer pages weren't actually under `/admin`/`/detailer`, breaking the middleware's role-prefix matching.

**Fix:** Moved both folders to real path segments — `app/admin/...` and `app/detailer/...` (no parens) — giving them genuine `/admin/*` and `/detailer/*` prefixes and resolving the collision. `(customer)` and `(marketing)` stay as route groups since those routes are intentionally flat (no `/customer` prefix wanted).

## 6. Directly-inserted `auth.users` rows broke login with a 500

**Error:** `POST /auth/v1/token?grant_type=password` → `{"code":500,"error_code":"unexpected_failure","msg":"Database error querying schema"}`. The app's login form just showed a bare `{}` as the error text (Supabase's client serializes an opaque 500 oddly).

**Root cause:** Test admin/detailer accounts were seeded by inserting directly into `auth.users`/`auth.identities` (to avoid Supabase Auth's email rate limit — see #7) but left `confirmation_token`, `recovery_token`, `email_change_token_new`, `email_change` as `NULL`. GoTrue's Go code scans these into non-nullable string fields; a `NULL` breaks the row scan and surfaces as a generic schema-query 500.

**Fix:** `UPDATE auth.users SET confirmation_token = coalesce(confirmation_token,''), recovery_token = coalesce(...,''), ... WHERE ...`. For any future manually-seeded auth user, set all the `*_token`/`email_change*` text columns to `''`, never `NULL`.

## 7. Supabase Auth email rate limit hit while seeding test accounts

**Error:** Third signup in quick succession (`admin1`) returned `"email rate limit exceeded"`.

**Fix:** Not worked around by relaxing any real setting — instead switched to seeding those two test accounts directly via SQL (see #6 for the follow-on issue that caused). For real users this rate limit is expected/desirable behavior and was left untouched.

## 8. `getPaymentProviders` broke the build: "Server Actions must be async functions"

**Error:** Build error pointing at `lib/actions/payments.ts` — a `"use server"` file where `getPaymentProviders()` was a synchronous function.

**Root cause:** Every export from a `"use server"` file is treated as a Server Action, and Next.js requires all of them to be `async`, even pure/synchronous config-reading helpers.

**Fix:** Made `getPaymentProviders` `async` (and awaited its call site). No behavior change, just a signature fix.

## 9. Anonymous (logged-out) catalog browsing failed: `permission denied for function is_admin`

**Error:** Clicking "Browse Cars" while logged out threw `{code: "42501", details: null, hint: ..., message: "permission denied for function is_admin"}` in a server component.

**Root cause:** Migration `0003_security_hardening` granted `EXECUTE` on the `private.*` RLS helpers (`is_admin()`, `is_detailer()`, `current_role()`) only to `authenticated`, never `anon`. That was fine for tables only signed-in users touch, but `catalog_brands`/`catalog_models`/`services` are meant to be publicly browsable — their policy is `is_active or private.is_admin()`. Postgres checks a referenced function's `EXECUTE` grant whenever a query plan touches it, independent of whether the boolean expression's `OR` would short-circuit around it at runtime — so every anonymous request failed outright, not just ones that needed the `is_admin()` branch. This is the same category of bug as #2 (schema `USAGE` grant), one layer down (function `EXECUTE` grant), and it was missed earlier because every test up to this point was run as a logged-in user.

**Fix:** `grant execute on function private.current_role() to anon;` (+ `is_admin()`, `is_detailer()`) — migration `0020`. This does not re-expose the functions over PostgREST RPC (`private` isn't in Supabase's exposed-schema list), it only lets RLS policy evaluation succeed for anonymous queries against public-read tables.

**Lesson:** Any RLS policy meant to be evaluated by `anon` needs its referenced functions granted to `anon` specifically — testing only as an authenticated user won't catch this, since `authenticated` had the grant all along.

## Notes for next time

- After any structural `app/` folder rename/move, always `rm -rf .next` before restarting the dev server — Turbopack's cache holds onto stale route manifests and produces confusing phantom errors (stale server-action IDs routing to the wrong action, 404s for pages that exist, etc.).
- When testing via scripted DOM clicks against a generic `button` CSS selector, scope the query to the actual content region (e.g. `main button`) — an unscoped `document.querySelectorAll('button')[0]` matches the navbar's "Sign out" button first, since it's earlier in the DOM.
