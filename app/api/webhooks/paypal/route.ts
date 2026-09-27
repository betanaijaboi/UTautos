import { NextResponse } from "next/server";
import { isPaypalConfigured } from "@/lib/config/feature-flags";
import { markDepositPaidByReference } from "@/lib/payments/webhook-helpers";

export async function POST(request: Request) {
  if (!isPaypalConfigured() || !process.env.PAYPAL_WEBHOOK_ID) {
    return NextResponse.json({ error: "PayPal webhooks not configured" }, { status: 503 });
  }

  let event;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Every delivery is checked with PayPal before we trust it. Without this,
  // anyone could POST a fake "capture completed" event and confirm a booking
  // without paying.
  const { verifyPaypalWebhookSignature } = await import("@/lib/payments/paypal");
  if (!(await verifyPaypalWebhookSignature(request.headers, event))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Only a completed capture means money moved. ORDER.APPROVED fires before
  // capture, so it must not confirm the booking.
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    // payments.provider_reference holds the PayPal order ID (see
    // createPaypalOrder), which a capture event carries in related_ids.
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    if (orderId) {
      await markDepositPaidByReference(orderId);
    }
  }

  return NextResponse.json({ received: true });
}
