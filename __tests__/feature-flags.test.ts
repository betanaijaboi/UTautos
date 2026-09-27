import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isApplePayConfigured,
  isGoogleMapsConfigured,
  isPaypalConfigured,
  isPaystackConfigured,
  isStripeConfigured,
} from "@/lib/config/feature-flags";

afterEach(() => vi.unstubAllEnvs());

const env = (vars: Record<string, string | undefined>) => {
  for (const [k, v] of Object.entries(vars)) vi.stubEnv(k, v as string);
};

describe("payment feature flags", () => {
  it("treats missing and REPLACE_ME placeholder values as not configured", () => {
    env({ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "" });
    expect(isGoogleMapsConfigured()).toBe(false);
    env({ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "GOOGLE_MAPS_REPLACE_ME" });
    expect(isGoogleMapsConfigured()).toBe(false);
    env({ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "AIzaRealKey" });
    expect(isGoogleMapsConfigured()).toBe(true);
  });

  it("Stripe (and Apple Pay, which rides on it) need both keys", () => {
    env({ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_real", STRIPE_SECRET_KEY: "sk_test_REPLACE_ME" });
    expect(isStripeConfigured()).toBe(false);
    expect(isApplePayConfigured()).toBe(false);
    env({ STRIPE_SECRET_KEY: "sk_test_real" });
    expect(isStripeConfigured()).toBe(true);
    expect(isApplePayConfigured()).toBe(true);
  });

  it("Paystack needs its secret key (it signs webhooks)", () => {
    env({ NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: "pk_test_real", PAYSTACK_SECRET_KEY: "" });
    expect(isPaystackConfigured()).toBe(false);
    env({ PAYSTACK_SECRET_KEY: "sk_test_real" });
    expect(isPaystackConfigured()).toBe(true);
  });

  it("PayPal needs its client secret", () => {
    env({ NEXT_PUBLIC_PAYPAL_CLIENT_ID: "client", PAYPAL_CLIENT_SECRET: "PAYPAL_SECRET_REPLACE_ME" });
    expect(isPaypalConfigured()).toBe(false);
    env({ PAYPAL_CLIENT_SECRET: "secret" });
    expect(isPaypalConfigured()).toBe(true);
  });
});
