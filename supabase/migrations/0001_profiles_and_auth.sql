-- Profiles, roles, and the auth-adjacent helpers every later RLS policy depends on.

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'detailer', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  phone text,
  avatar_url text,
  default_face_blur_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Security-definer helpers used by every RLS policy across the schema.
create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = 'admin'
$$;

create or replace function public.is_detailer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = 'detailer'
$$;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Block a user from escalating their own role; admins may still change roles
-- directly (e.g. from the admin dashboard, or a one-off SQL promotion).
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and auth.uid() = old.id and not public.is_admin() then
    raise exception 'You cannot change your own role.';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

alter table public.profiles enable row level security;

-- Base policy: self + admin. Extended in 0007 (bookings) to also let a
-- detailer read the profile of a customer whose booking is assigned to them.
create policy profiles_select on public.profiles for select using (
  id = auth.uid() or public.is_admin()
);

create policy profiles_update on public.profiles for update using (
  id = auth.uid() or public.is_admin()
);
