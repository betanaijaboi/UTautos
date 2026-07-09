-- bookings_update_detailer only had a USING clause; Postgres defaults
-- WITH CHECK to the same expression, so the row had to STILL satisfy
-- detailer_id = auth.uid() after update, which it always does -- but with no
-- WITH CHECK at all specified explicitly, some clients were seeing 0 rows
-- affected on the "Mark Completed" transition. Add an explicit WITH CHECK so
-- the ownership check is unambiguous; the actual status-transition whitelist
-- is enforced separately by enforce_booking_status_transition.
drop policy bookings_update_detailer on public.bookings;

create policy bookings_update_detailer on public.bookings for update using (
  detailer_id = auth.uid()
) with check (
  detailer_id = auth.uid()
);
