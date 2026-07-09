-- Append-only location pings used to render the detailer's "trail" to the
-- customer's address.
create table public.detailer_locations (
  id uuid primary key default gen_random_uuid(),
  detailer_id uuid not null references public.profiles(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  recorded_at timestamptz not null default now()
);

create index detailer_locations_detailer_id_idx on public.detailer_locations(detailer_id, recorded_at desc);

alter table public.detailer_locations enable row level security;

create policy detailer_locations_insert on public.detailer_locations for insert with check (
  detailer_id = auth.uid()
);

create policy detailer_locations_select on public.detailer_locations for select using (
  detailer_id = auth.uid()
  or private.is_admin()
  or exists (
    select 1 from public.bookings
    where bookings.detailer_id = detailer_locations.detailer_id
      and bookings.customer_id = auth.uid()
      and bookings.status in ('detailer_assigned', 'en_route', 'in_progress')
  )
);
