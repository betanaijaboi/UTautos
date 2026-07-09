-- Supabase performance advisor flagged foreign keys without a covering index.
create index if not exists bookings_garage_item_id_idx on public.bookings(garage_item_id);
create index if not exists bookings_address_id_idx on public.bookings(address_id);
create index if not exists bookings_consent_id_idx on public.bookings(consent_id);
create index if not exists booking_services_service_id_idx on public.booking_services(service_id);
create index if not exists payments_confirmed_by_idx on public.payments(confirmed_by);
