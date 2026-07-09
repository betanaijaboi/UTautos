create type public.catalog_type as enum ('car', 'jet');

create table public.catalog_brands (
  id uuid primary key default gen_random_uuid(),
  type public.catalog_type not null,
  name text not null,
  slug text not null unique,
  monogram text not null,
  hero_style jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.catalog_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.catalog_brands(id) on delete cascade,
  type public.catalog_type not null,
  name text not null,
  slug text not null unique,
  model_year_range text,
  tagline text,
  hero_style jsonb not null default '{}'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index catalog_models_brand_id_idx on public.catalog_models(brand_id);
create index catalog_brands_type_idx on public.catalog_brands(type);
create index catalog_models_type_idx on public.catalog_models(type);

-- A model's type must match its brand's type.
create or replace function public.enforce_model_type_matches_brand()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.type <> (select type from public.catalog_brands where id = new.brand_id) then
    raise exception 'catalog_models.type must match its brand''s type';
  end if;
  return new;
end;
$$;

create trigger catalog_models_enforce_type
  before insert or update on public.catalog_models
  for each row execute function public.enforce_model_type_matches_brand();

alter table public.catalog_brands enable row level security;
alter table public.catalog_models enable row level security;

create policy catalog_brands_public_read on public.catalog_brands for select using (
  is_active or private.is_admin()
);
create policy catalog_brands_admin_write on public.catalog_brands for all using (
  private.is_admin()
) with check (private.is_admin());

create policy catalog_models_public_read on public.catalog_models for select using (
  is_active or private.is_admin()
);
create policy catalog_models_admin_write on public.catalog_models for all using (
  private.is_admin()
) with check (private.is_admin());
