function isConfigured(value: string | undefined): boolean {
  return !!value && !value.includes("REPLACE_ME");
}

export function isGoogleMapsConfigured() {
  return isConfigured(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

export function isStripeConfigured() {
  return (
    isConfigured(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) &&
    isConfigured(process.env.STRIPE_SECRET_KEY)
  );
}

// Paystack and PayPal need their server-side secrets too: the secret key signs
// Paystack webhooks and authenticates PayPal API calls.
export function isPaystackConfigured() {
  return (
    isConfigured(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) &&
    isConfigured(process.env.PAYSTACK_SECRET_KEY)
  );
}

export function isPaypalConfigured() {
  return (
    isConfigured(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) &&
    isConfigured(process.env.PAYPAL_CLIENT_SECRET)
  );
}

export function isApplePayConfigured() {
  // Apple Pay rides on Stripe's PaymentRequest button in this app.
  return isStripeConfigured();
}
