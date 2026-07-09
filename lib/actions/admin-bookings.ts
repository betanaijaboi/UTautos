"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Admin access required");
  return supabase;
}

export async function getAllBookings() {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, customer:profiles!bookings_customer_id_fkey(full_name, phone), garage_item:garage_items(*, catalog_model:catalog_models(*, brand:catalog_brands(*))), address:addresses(*), detailer:profiles!bookings_detailer_id_fkey(full_name)",
    )
    .neq("status", "pending_payment")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAdminBookingDetail(bookingId: string) {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, customer:profiles!bookings_customer_id_fkey(full_name, phone), garage_item:garage_items(*, catalog_model:catalog_models(*, brand:catalog_brands(*))), address:addresses(*), detailer:profiles!bookings_detailer_id_fkey(id, full_name), booking_services(*, service:services(*)), payments(*)",
    )
    .eq("id", bookingId)
    .single();

  if (error) return null;
  return data;
}

export async function getPendingManualPayments() {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("payments")
    .select("*, booking:bookings(id, customer:profiles!bookings_customer_id_fkey(full_name))")
    .eq("provider", "bank_transfer")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDetailers() {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "detailer");

  if (error) throw error;
  return data;
}

export async function confirmManualPayment(paymentId: string) {
  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: payment, error: fetchError } = await supabase
    .from("payments")
    .select("booking_id")
    .eq("id", paymentId)
    .single();

  if (fetchError || !payment) return { ok: false, error: "Payment not found" };

  const { error: paymentError } = await supabase
    .from("payments")
    .update({ status: "manually_confirmed", confirmed_by: user!.id, confirmed_at: new Date().toISOString() })
    .eq("id", paymentId);

  if (paymentError) return { ok: false, error: paymentError.message };

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", payment.booking_id)
    .eq("status", "pending_payment");

  if (bookingError) return { ok: false, error: bookingError.message };

  revalidatePath("/admin/payments");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function assignDetailer(bookingId: string, detailerId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("bookings")
    .update({ detailer_id: detailerId, status: "detailer_assigned" })
    .eq("id", bookingId)
    .eq("status", "confirmed");

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/bookings/${bookingId}`);
  return { ok: true };
}
