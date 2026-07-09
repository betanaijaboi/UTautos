import "server-only";
import { isPaystackConfigured } from "@/lib/config/feature-flags";

export async function initializePaystackTransaction(
  amountCents: number,
  email: string,
  bookingId: string,
) {
  if (!isPaystackConfigured()) throw new Error("Paystack is not configured");

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountCents, // Paystack uses the smallest currency unit, same as our cents.
      metadata: { bookingId },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Paystack initialization failed");
  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyPaystackTransaction(reference: string) {
  if (!isPaystackConfigured()) throw new Error("Paystack is not configured");

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Paystack verification failed");
  return data.data as { status: string; reference: string; amount: number };
}
