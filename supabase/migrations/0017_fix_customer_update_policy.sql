-- Same missing-WITH-CHECK issue as the detailer policy: bookings_update_customer
-- only had a USING clause, defaulting WITH CHECK to the same expression
-- (status = 'pending_payment'), which silently blocked the customer's cancel
-- transition (new row has status = 'cancelled', failing the implicit check).
drop policy bookings_update_customer on public.bookings;

create policy bookings_update_customer on public.bookings for update using (
  customer_id = auth.uid() and status = 'pending_payment'
) with check (
  customer_id = auth.uid()
);
