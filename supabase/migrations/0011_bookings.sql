create type public.booking_type as enum ('scheduled', 'express');
create type public.booking_status as enum (
  'pending_payment', 'deposit_paid', 'confirmed', 'detailer_assigned',
  'en_route', 'in_progress', 'completed', 'cancelled'
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  garage_item_id uuid not null references public.garage_items(id) on delete cascade,
  address_id uuid not null references public.addresses(id),
  detailer_id uuid references public.profiles(id),
  booking_type public.booking_type not null default 'scheduled',
  status public.booking_status not null default 'pending_payment',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  express_window_start timestamptz,
  express_window_end timestamptz,
  subtotal_cents integer not null,
  deposit_percent numeric not null default 10.00,
  deposit_cents integer not null,
  total_cents integer not null,
  face_blur_opt_in boolean not null default true,
  consent_id uuid references public.consents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_customer_id_idx on public.bookings(customer_id);
create index bookings_detailer_id_idx on public.bookings(detailer_id);
create index bookings_status_idx on public.bookings(status);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

create table public.booking_services (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  service_id uuid not null references public.services(id),
  price_cents_snapshot integer not null,
  quantity integer not null default 1
);

create index booking_services_booking_id_idx on public.booking_services(booking_id);

-- Whitelisted status transitions only. Customers may only cancel from
-- pending_payment; staff drive the rest of the lifecycle forward.
create or replace function public.enforce_booking_status_transition()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_is_admin boolean := private.is_admin();
  v_is_detailer boolean := private.is_detailer();
  v_is_customer boolean := new.customer_id = auth.uid();
begin
  if new.status = old.status then
    return new;
  end if;

  if v_is_admin then
    return new;
  end if;

  if v_is_customer and not v_is_detailer then
    if old.status = 'pending_payment' and new.status = 'cancelled' then
      return new;
    end if;
    raise exception 'Customers may only cancel a booking pending payment.';
  end if;

  if v_is_detailer and new.detailer_id = auth.uid() then
    if old.status = 'detailer_assigned' and new.status = 'en_route' then
      return new;
    end if;
    if old.status = 'en_route' and new.status = 'in_progress' then
      return new;
    end if;
    if old.status = 'in_progress' and new.status = 'completed' then
      return new;
    end if;
    raise exception 'Invalid status transition for detailer.';
  end if;

  raise exception 'You are not permitted to change this booking''s status.';
end;
$$;

create trigger bookings_enforce_status_transition
  before update on public.bookings
  for each row execute function public.enforce_booking_status_transition();

-- DB-level enforcement of "only when the deposit is paid is a detailer
-- mobilized": detailer_assigned (or later) is unreachable unless the booking
-- has already passed through confirmed.
create or replace function public.enforce_deposit_gate_on_mobilize()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status in ('detailer_assigned', 'en_route', 'in_progress', 'completed')
     and old.status = 'pending_payment' then
    raise exception 'Cannot mobilize a detailer before the deposit is paid.';
  end if;
  if new.detailer_id is not null and old.detailer_id is null
     and new.status not in ('detailer_assigned', 'en_route', 'in_progress', 'completed') then
    raise exception 'Cannot assign a detailer before the booking is confirmed.';
  end if;
  return new;
end;
$$;

create trigger bookings_enforce_deposit_gate
  before update on public.bookings
  for each row execute function public.enforce_deposit_gate_on_mobilize();

-- Express bookings can only be created by staff (phone intake), never
-- persisted directly by a customer session.
create or replace function public.enforce_express_role_gate()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.booking_type = 'express' and not (private.is_admin() or private.is_detailer()) then
    raise exception 'Express bookings can only be created by staff via phone intake.';
  end if;
  return new;
end;
$$;

create trigger bookings_enforce_express_role_gate
  before insert on public.bookings
  for each row execute function public.enforce_express_role_gate();

alter table public.bookings enable row level security;
alter table public.booking_services enable row level security;

create policy bookings_select on public.bookings for select using (
  customer_id = auth.uid() or detailer_id = auth.uid() or private.is_admin()
);

create policy bookings_insert on public.bookings for insert with check (
  customer_id = auth.uid() or private.is_admin() or private.is_detailer()
);

create policy bookings_update_customer on public.bookings for update using (
  customer_id = auth.uid() and status = 'pending_payment'
);

create policy bookings_update_detailer on public.bookings for update using (
  detailer_id = auth.uid()
);

create policy bookings_update_admin on public.bookings for update using (
  private.is_admin()
) with check (private.is_admin());

create policy booking_services_select on public.booking_services for select using (
  exists (
    select 1 from public.bookings
    where bookings.id = booking_services.booking_id
      and (bookings.customer_id = auth.uid() or bookings.detailer_id = auth.uid() or private.is_admin())
  )
);

create policy booking_services_insert on public.booking_services for insert with check (
  exists (
    select 1 from public.bookings
    where bookings.id = booking_services.booking_id
      and (bookings.customer_id = auth.uid() or private.is_admin())
  )
);

-- Dev-mode payment confirmation (superseded/hardened in a later migration).
create or replace function public.confirm_dev_payment(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
begin
  select * into v_booking from public.bookings where id = p_booking_id;

  if v_booking.customer_id <> auth.uid() then
    raise exception 'Not authorized.';
  end if;

  update public.payments
    set status = 'succeeded', dev_mode = true, confirmed_at = now()
    where booking_id = p_booking_id and type = 'deposit' and status = 'pending';

  update public.bookings
    set status = 'confirmed'
    where id = p_booking_id and status = 'pending_payment';
end;
$$;
