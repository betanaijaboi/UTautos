-- consent_id was added to the bookings table definition in 0011 already in
-- this reconstruction, but was actually added via a follow-up ALTER in the
-- original build. Kept as a no-op-safe guard for reproducibility.
alter table public.bookings
  add column if not exists consent_id uuid references public.consents(id);
