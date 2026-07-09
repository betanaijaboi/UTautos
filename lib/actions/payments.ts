"use server";

import { createClient } from "@/lib/supabase/server";
import {
  isStripeConfigured,
  isPaystackConfigured,
  isPaypalConfigured,
  isApplePayConfigured,
} from "@/lib/config/feature-flags";
import type { PaymentProviderId, PaymentProviderMeta } from "@/lib/payments/types";

export async function getPaymentProviders(): Promise<PaymentProviderMeta[]> {
  return [
    {
      id: "stripe",
      label: "Card",
      description: "Visa, Mastercard, Amex via Stripe.",
      configured: isStripeConfigured(),
    },
    {
      id: "apple_pay",
      label: "Apple Pay",
      description: "Pay instantly with Face ID / Touch ID.",
      configured: isApplePayConfigured(),
    },
    {
      id: "paystack",
      label: "Paystack",
      description: "Cards, bank transfer, USSD.",
      configured: isPaystackConfigured(),
    },
    {
      id: "paypal",
      label: "PayPal",
      description: "Pay with your PayPal balance or card.",
      configured: isPaypalConfigured(),
    },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      description: "Manual transfer, confirmed by our team.",
      configured: true,
    },
  ];
}

export type BeginPaymentResult =
  | { ok: true; mode: "redirect"; url: string }
  | { ok: true; mode: "client_secret"; clientSecret: string }
  | { ok: true; mode: "bank_transfer" }
  | { ok: true; mode: "dev"; }
  | { ok: false; error: string };

export async function beginPayment(
  bookingId: string,
  provider: PaymentProviderId,
): Promise<BeginPaymentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, deposit_cents, customer_id, status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.customer_id !== user.id) {
    return { ok: false, error: "Booking not found" };
  }
  if (booking.status !== "pending_payment") {
    return { ok: false, error: "This booking has already been paid." };
  }

  if (provider === "stripe" || provider === "apple_pay") {
    if (!isStripeConfigured()) return { ok: true, mode: "dev" };
    const { createStripePaymentIntent } = await import("@/lib/payments/stripe");
    const intent = await createStripePaymentIntent(booking.deposit_cents, bookingId);
    await supabase.from("payments").insert({
      booking_id: bookingId,
      provider,
      status: "pending",
      amount_cents: booking.deposit_cents,
      provider_reference: intent.id,
    });
    return { ok: true, mode: "client_secret", clientSecret: intent.clientSecret! };
  }

  if (provider === "paystack") {
    if (!isPaystackConfigured()) return { ok: true, mode: "dev" };
    const { initializePaystackTransaction } = await import("@/lib/payments/paystack");
    const result = await initializePaystackTransaction(
      booking.deposit_cents,
      user.email!,
      bookingId,
    );
    await supabase.from("payments").insert({
      booking_id: bookingId,
      provider,
      status: "pending",
      amount_cents: booking.deposit_cents,
      provider_reference: result.reference,
    });
    return { ok: true, mode: "redirect", url: result.authorization_url };
  }

  if (provider === "paypal") {
    if (!isPaypalConfigured()) return { ok: true, mode: "dev" };
    const { createPaypalOrder } = await import("@/lib/payments/paypal");
    const order = await createPaypalOrder(booking.deposit_cents, bookingId);
    await supabase.from("payments").insert({
      booking_id: bookingId,
      provider,
      status: "pending",
      amount_cents: booking.deposit_cents,
      provider_reference: order.id,
    });
    return { ok: true, mode: "client_secret", clientSecret: order.id };
  }

  if (provider === "bank_transfer") {
    await supabase.from("payments").insert({
      booking_id: bookingId,
      provider: "bank_transfer",
      status: "pending",
      amount_cents: booking.deposit_cents,
    });
    return { ok: true, mode: "bank_transfer" };
  }

  return { ok: false, error: "Unknown provider" };
}

export type ConfirmDevResult = { ok: true } | { ok: false; error: string };

export async function confirmDevPayment(
  bookingId: string,
  provider: PaymentProviderId,
): Promise<ConfirmDevResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("confirm_dev_payment", {
    p_booking_id: bookingId,
    p_provider: provider,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
