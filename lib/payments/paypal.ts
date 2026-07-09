import "server-only";
import { isPaypalConfigured } from "@/lib/config/feature-flags";

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const creds = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) throw new Error("PayPal auth failed");
  return data.access_token as string;
}

export async function createPaypalOrder(amountCents: number, bookingId: string) {
  if (!isPaypalConfigured()) throw new Error("PayPal is not configured");

  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: bookingId,
          amount: { currency_code: "USD", value: (amountCents / 100).toFixed(2) },
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PayPal order creation failed");
  return data as { id: string };
}

export async function capturePaypalOrder(orderId: string) {
  if (!isPaypalConfigured()) throw new Error("PayPal is not configured");

  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PayPal capture failed");
  return data;
}
