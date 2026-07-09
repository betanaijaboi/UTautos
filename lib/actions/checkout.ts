"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const DEPOSIT_PERCENT = 10;

export async function getGarageItemForCheckout(garageItemId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("garage_items")
    .select("*, catalog_model:catalog_models(*, brand:catalog_brands(*))")
    .eq("id", garageItemId)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function getServicesForType(type: "car" | "jet") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("type", type)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data;
}

export async function getMyBookings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, garage_item:garage_items(*, catalog_model:catalog_models(*, brand:catalog_brands(*)))",
    )
    .eq("customer_id", user.id)
    .neq("status", "pending_payment")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBookingDraft(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, garage_item:garage_items(*, catalog_model:catalog_models(*, brand:catalog_brands(*))), address:addresses(*), booking_services(*, service:services(*))",
    )
    .eq("id", bookingId)
    .single();

  if (error) return null;
  return data;
}

export type CreateDraftResult = { ok: true; bookingId: string } | { ok: false; error: string };

export async function createDraftBooking(garageItemId: string): Promise<CreateDraftResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  // Reuse an existing draft for this vehicle rather than piling up abandoned rows.
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("customer_id", user.id)
    .eq("garage_item_id", garageItemId)
    .eq("status", "pending_payment")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return { ok: true, bookingId: existing.id };

  const { data, error } = await supabase
    .from("bookings")
    .insert({ customer_id: user.id, garage_item_id: garageItemId })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, bookingId: data.id };
}

export type SetServicesResult = { ok: true } | { ok: false; error: string };

export async function setBookingServices(
  bookingId: string,
  serviceIds: string[],
): Promise<SetServicesResult> {
  const supabase = await createClient();

  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .in("id", serviceIds)
    .eq("is_express", false); // Express can never be persisted via customer checkout.

  if (servicesError) return { ok: false, error: servicesError.message };

  await supabase.from("booking_services").delete().eq("booking_id", bookingId);

  if (services.length > 0) {
    const { error: insertError } = await supabase.from("booking_services").insert(
      services.map((s) => ({
        booking_id: bookingId,
        service_id: s.id,
        price_cents_snapshot: s.price_cents,
      })),
    );
    if (insertError) return { ok: false, error: insertError.message };
  }

  const subtotal = services.reduce((sum, s) => sum + s.price_cents, 0);
  const deposit = Math.round((subtotal * DEPOSIT_PERCENT) / 100);

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ subtotal_cents: subtotal, deposit_cents: deposit, total_cents: subtotal })
    .eq("id", bookingId);

  if (updateError) return { ok: false, error: updateError.message };

  revalidatePath("/checkout");
  return { ok: true };
}

export async function setBookingAddress(bookingId: string, addressId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ address_id: addressId })
    .eq("id", bookingId);

  revalidatePath("/checkout");
  return { ok: !error, error: error?.message };
}

export async function setBookingSchedule(
  bookingId: string,
  scheduledStart: string,
  scheduledEnd: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ scheduled_start: scheduledStart, scheduled_end: scheduledEnd })
    .eq("id", bookingId);

  revalidatePath("/checkout");
  return { ok: !error, error: error?.message };
}

export async function setBookingFaceBlur(bookingId: string, optIn: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ face_blur_opt_in: optIn })
    .eq("id", bookingId);

  return { ok: !error };
}

export async function cancelDraftBooking(bookingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("status", "pending_payment");

  return { ok: !error };
}
