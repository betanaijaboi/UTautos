create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  lat double precision,
  lng double precision,
  place_id text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_customer_id_idx on public.addresses(customer_id);

alter table public.addresses enable row level security;

create policy addresses_select on public.addresses for select using (
  customer_id = auth.uid()
  or private.is_admin()
  or exists (
    select 1 from public.bookings
    where bookings.address_id = addresses.id
      and bookings.detailer_id = auth.uid()
  )
);

create policy addresses_insert on public.addresses for insert with check (
  customer_id = auth.uid()
);

create policy addresses_update on public.addresses for update using (
  customer_id = auth.uid()
) with check (
  customer_id = auth.uid()
);

create policy addresses_delete on public.addresses for delete using (
  customer_id = auth.uid()
);
