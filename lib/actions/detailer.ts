"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getMyAssignedBookings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, customer:profiles!bookings_customer_id_fkey(full_name, phone), garage_item:garage_items(*, catalog_model:catalog_models(*, brand:catalog_brands(*))), address:addresses(*)",
    )
    .eq("detailer_id", user.id)
    .in("status", ["detailer_assigned", "en_route", "in_progress"])
    .order("scheduled_start", { ascending: true });

  if (error) throw error;
  return data;
}

type BookingStatus =
  | "pending_payment"
  | "deposit_paid"
  | "confirmed"
  | "detailer_assigned"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled";

const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  detailer_assigned: "en_route",
  en_route: "in_progress",
  in_progress: "completed",
};

export async function advanceBookingStatus(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data: booking } = await supabase
    .from("bookings")
    .select("status, detailer_id")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.detailer_id !== user.id) {
    return { ok: false, error: "Not your booking" };
  }

  const next = NEXT_STATUS[booking.status];
  if (!next) return { ok: false, error: "No further status to advance to" };

  const { error } = await supabase
    .from("bookings")
    .update({ status: next })
    .eq("id", bookingId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/detailer/dashboard");
  return { ok: true, newStatus: next };
}

export async function pingDetailerLocation(lat: number, lng: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { error } = await supabase
    .from("detailer_locations")
    .insert({ detailer_id: user.id, lat, lng });

  return { ok: !error };
}

export async function getLatestDetailerLocation(detailerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("detailer_locations")
    .select("lat, lng, recorded_at")
    .eq("detailer_id", detailerId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}
