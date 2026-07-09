create type public.garage_removed_reason as enum (
  'sold', 'accident', 'upgrade', 'none_of_your_business', 'other'
);

create table public.garage_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  catalog_model_id uuid not null references public.catalog_models(id) on delete cascade,
  nickname text,
  is_active boolean not null default true,
  removed_at timestamptz,
  removed_reason public.garage_removed_reason,
  removed_reason_note text,
  created_at timestamptz not null default now()
);

create index garage_items_customer_id_idx on public.garage_items(customer_id);
create index garage_items_catalog_model_id_idx on public.garage_items(catalog_model_id);

-- "Select vehicle -> auto-add to garage" is an upsert; this makes it idempotent
-- per customer+model while a prior soft-deleted row doesn't block re-adding.
create unique index garage_items_active_unique_idx
  on public.garage_items(customer_id, catalog_model_id)
  where is_active;

alter table public.garage_items enable row level security;

create policy garage_items_select on public.garage_items for select using (
  customer_id = auth.uid()
  or private.is_admin()
  or exists (
    select 1 from public.bookings
    where bookings.garage_item_id = garage_items.id
      and bookings.detailer_id = auth.uid()
  )
);

create policy garage_items_insert on public.garage_items for insert with check (
  customer_id = auth.uid() or private.is_admin()
);

create policy garage_items_update on public.garage_items for update using (
  customer_id = auth.uid() or private.is_admin()
) with check (
  customer_id = auth.uid() or private.is_admin()
);

-- No delete policy: removal is always the soft-delete state machine above,
-- enforced at the DB layer, not just the UI.
