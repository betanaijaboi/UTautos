-- confirm_dev_payment had a NULL-bypass vulnerability: `if v_booking.customer_id
-- <> auth.uid() then raise exception` evaluates to NULL (not true) when
-- auth.uid() is NULL (anonymous caller), and `IF NULL THEN` is treated as
-- false in PL/pgSQL, silently skipping the guard entirely.
create or replace function public.confirm_dev_payment(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
begin
  if auth.uid() is null then
    raise exception 'Not authorized.';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id;

  if v_booking.id is null then
    raise exception 'Booking not found.';
  end if;

  if v_booking.customer_id is distinct from auth.uid() then
    raise exception 'Not authorized.';
  end if;

  update public.payments
    set status = 'succeeded', dev_mode = true, confirmed_at = now()
    where booking_id = p_booking_id and type = 'deposit' and status = 'pending';

  update public.bookings
    set status = 'confirmed'
    where id = p_booking_id and status = 'pending_payment';
end;
$$;

revoke execute on function public.confirm_dev_payment(uuid) from public, anon;
grant execute on function public.confirm_dev_payment(uuid) to authenticated;
