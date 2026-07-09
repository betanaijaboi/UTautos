create table public.services (
  id uuid primary key default gen_random_uuid(),
  type public.catalog_type not null,
  name text not null,
  description text,
  price_cents integer not null,
  duration_minutes integer not null,
  is_express boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index services_type_idx on public.services(type);

-- "Express is always the priciest option" is a DB invariant, not just seed data
-- discipline: any insert/update must keep the express row's price >= every
-- non-express row of the same type, and vice versa.
create or replace function public.enforce_express_is_max_price()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_max_non_express integer;
  v_min_express integer;
begin
  select max(price_cents) into v_max_non_express
    from public.services where type = new.type and is_express = false and id <> new.id;
  select min(price_cents) into v_min_express
    from public.services where type = new.type and is_express = true and id <> new.id;

  if new.is_express then
    if v_max_non_express is not null and new.price_cents < v_max_non_express then
      raise exception 'Express service must be priced at or above every non-express service.';
    end if;
  else
    if v_min_express is not null and new.price_cents > v_min_express then
      raise exception 'Non-express service must be priced at or below every express service.';
    end if;
  end if;

  return new;
end;
$$;

create trigger services_enforce_express_price
  before insert or update on public.services
  for each row execute function public.enforce_express_is_max_price();

alter table public.services enable row level security;

create policy services_public_read on public.services for select using (
  is_active or private.is_admin()
);
create policy services_admin_write on public.services for all using (
  private.is_admin()
) with check (private.is_admin());
