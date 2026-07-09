import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/config/feature-flags";
import { markDepositPaidByReference } from "@/lib/payments/webhook-helpers";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const { constructStripeWebhookEvent } = await import("@/lib/payments/stripe");
    const event = constructStripeWebhookEvent(payload, signature);

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as { id: string };
      await markDepositPaidByReference(intent.id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook error" },
      { status: 400 },
    );
  }
}
