-- RLS policies reference private.* functions. Postgres checks function-reference
-- permissions at query-plan time regardless of OR short-circuiting, so any query
-- whose policy touches a private.* function fails outright once that branch is
-- evaluated unless USAGE on the schema itself is granted (not just EXECUTE on
-- the functions).
grant usage on schema private to authenticated, anon;
