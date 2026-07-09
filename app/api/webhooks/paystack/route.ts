import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { isPaystackConfigured } from "@/lib/config/feature-flags";
import { markDepositPaidByReference } from "@/lib/payments/webhook-helpers";

export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-paystack-signature");
  const payload = await request.text();

  const expected = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(payload)
    .digest("hex");

  if (
    !signature ||
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.event === "charge.success") {
    await markDepositPaidByReference(event.data.reference);
  }

  return NextResponse.json({ received: true });
}
