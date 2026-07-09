"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DISCLAIMER_VERSION } from "@/lib/config/disclaimer";

export async function updateDefaultFaceBlur(optIn: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("profiles")
    .update({ default_face_blur_opt_in: optIn })
    .eq("id", user.id);

  revalidatePath("/account");
  return { ok: !error };
}

export async function recordCheckoutConsent(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { data: consent, error } = await supabase
    .from("consents")
    .insert({
      customer_id: user.id,
      consent_type: "smart_glasses_recording",
      version: DISCLAIMER_VERSION,
      accepted: true,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };

  await supabase.from("bookings").update({ consent_id: consent.id }).eq("id", bookingId);

  return { ok: true as const, consentId: consent.id };
}
