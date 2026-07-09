create type public.payment_type as enum ('deposit', 'remainder');
create type public.payment_provider as enum ('stripe', 'paystack', 'paypal', 'apple_pay', 'bank_transfer');
create type public.payment_status as enum (
  'pending', 'processing', 'succeeded', 'failed', 'manually_confirmed', 'refunded'
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  type public.payment_type not null,
  provider public.payment_provider not null,
  status public.payment_status not null default 'pending',
  amount_cents integer not null,
  provider_reference text,
  dev_mode boolean not null default false,
  confirmed_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index payments_booking_id_idx on public.payments(booking_id);

alter table public.payments enable row level security;

-- Deliberately not readable by detailers: they only ever see booking status,
-- never payment detail.
create policy payments_select on public.payments for select using (
  exists (
    select 1 from public.bookings
    where bookings.id = payments.booking_id and bookings.customer_id = auth.uid()
  )
  or private.is_admin()
);

create policy payments_insert on public.payments for insert with check (
  status = 'pending'
  and exists (
    select 1 from public.bookings
    where bookings.id = payments.booking_id and bookings.customer_id = auth.uid()
  )
);

-- Real provider confirmations land via webhook route handlers using the
-- service-role client (no user session there, so RLS is bypassed by design).
-- From the client, only admin can move a payment to succeeded/manually_confirmed.
create policy payments_update_admin on public.payments for update using (
  private.is_admin()
) with check (private.is_admin());
