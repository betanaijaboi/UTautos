-- Harden function search_path, and move internal RLS helpers into a
-- non-exposed `private` schema so they can't be invoked over PostgREST RPC
-- by anon/authenticated clients (they remain callable from within RLS
-- policies/functions, which is all they're for).

create schema if not exists private;

alter function public.set_updated_at() set search_path = public;

create or replace function private.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid()
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select private.current_role() = 'admin'
$$;

create or replace function private.is_detailer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select private.current_role() = 'detailer'
$$;

revoke execute on function private.current_role() from public, anon, authenticated;
revoke execute on function private.is_admin() from public, anon, authenticated;
revoke execute on function private.is_detailer() from public, anon, authenticated;
grant execute on function private.current_role() to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_detailer() to authenticated;

-- Re-point profiles RLS at the private helpers.
drop policy profiles_select on public.profiles;
drop policy profiles_update on public.profiles;

create policy profiles_select on public.profiles for select using (
  id = auth.uid() or private.is_admin()
);

create policy profiles_update on public.profiles for update using (
  id = auth.uid() or private.is_admin()
);

-- Re-point consents RLS before dropping the old public helpers.
drop policy consents_select on public.consents;
create policy consents_select on public.consents for select using (
  customer_id = auth.uid() or private.is_admin()
);

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and auth.uid() = old.id and not private.is_admin() then
    raise exception 'You cannot change your own role.';
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_role_self_escalation() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

drop function if exists public.current_role();
drop function if exists public.is_admin();
drop function if exists public.is_detailer();
