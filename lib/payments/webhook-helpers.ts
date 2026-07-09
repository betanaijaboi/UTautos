import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Called only from signature-verified webhook route handlers, using the
 * service-role client (no user session exists at that point). Marks the
 * matching payment succeeded and confirms the booking, mirroring what
 * confirm_dev_payment() does for the dev-mode path — but this is the
 * trusted, real-money path.
 */
export async function markDepositPaidByReference(providerReference: string) {
  const supabase = createAdminClient();

  const { data: payment, error: findError } = await supabase
    .from("payments")
    .select("id, booking_id, status")
    .eq("provider_reference", providerReference)
    .single();

  if (findError || !payment) {
    throw new Error(`No payment found for reference ${providerReference}`);
  }
  if (payment.status === "succeeded") {
    return; // Already processed — webhooks can retry/duplicate.
  }

  await supabase
    .from("payments")
    .update({ status: "succeeded" })
    .eq("id", payment.id);

  await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", payment.booking_id)
    .eq("status", "pending_payment");
}
