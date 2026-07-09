-- handle_new_user runs SECURITY DEFINER at signup time, before any client
-- session exists (email confirmation may be pending). Client-side writes to
-- profiles/consents at that point are silently blocked by RLS (no auth.uid()
-- yet). Fix: do the phone + consent writes here instead, from data the
-- client already validated and passed as auth signup metadata.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );

  if (new.raw_user_meta_data ->> 'consent')::boolean is true then
    insert into public.consents (customer_id, consent_type, version, accepted)
    values
      (new.id, 'smart_glasses_recording', coalesce(new.raw_user_meta_data ->> 'disclaimer_version', 'v1'), true),
      (new.id, 'terms', coalesce(new.raw_user_meta_data ->> 'disclaimer_version', 'v1'), true);
  end if;

  return new;
end;
$$;
