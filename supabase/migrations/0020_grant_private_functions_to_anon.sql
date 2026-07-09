-- catalog_brands / catalog_models / services are meant to be publicly readable
-- (logged-out browsing), but their RLS policies call private.is_admin(), which
-- was only ever granted to `authenticated`. Anonymous requests failed with
-- "permission denied for function is_admin". Grant execute to anon too.
grant execute on function private.current_role() to anon;
grant execute on function private.is_admin() to anon;
grant execute on function private.is_detailer() to anon;
