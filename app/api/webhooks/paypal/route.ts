import { NextResponse } from "next/server";
import { isPaypalConfigured } from "@/lib/config/feature-flags";
import { markDepositPaidByReference } from "@/lib/payments/webhook-helpers";

export async function POST(request: Request) {
  if (!isPaypalConfigured()) {
    return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  }

  // PayPal webhook signature verification requires calling PayPal's
  // v1/notifications/verify-webhook-signature endpoint with the transmission
  // headers below plus PAYPAL_WEBHOOK_ID (set this once a webhook is
  // registered in the PayPal dashboard). Left as a clear extension point
  // since there's no live webhook to register without real credentials.
  const event = await request.json();

  if (event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id ?? event.resource?.id;
    if (orderId) {
      await markDepositPaidByReference(orderId);
    }
  }

  return NextResponse.json({ received: true });
}
