import "server-only";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/config/feature-flags";

let client: Stripe | null = null;

function getClient(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return client;
}

export async function createStripePaymentIntent(amountCents: number, bookingId: string) {
  const stripe = getClient();
  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { bookingId },
  });
  return { clientSecret: intent.client_secret, id: intent.id };
}

export function constructStripeWebhookEvent(payload: string, signature: string) {
  const stripe = getClient();
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}
