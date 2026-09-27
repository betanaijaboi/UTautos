import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const markDepositPaidByReference = vi.fn();
const constructStripeWebhookEvent = vi.fn();
vi.mock("@/lib/payments/webhook-helpers", () => ({ markDepositPaidByReference }));
vi.mock("@/lib/payments/stripe", () => ({ constructStripeWebhookEvent }));

const { POST } = await import("@/app/api/webhooks/stripe/route");

const request = (signature?: string) =>
  new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body: "{}",
    headers: signature ? { "stripe-signature": signature } : {},
  });

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_real");
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_real");
  markDepositPaidByReference.mockReset();
  constructStripeWebhookEvent.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/webhooks/stripe", () => {
  it("confirms the deposit for payment_intent.succeeded", async () => {
    constructStripeWebhookEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_123" } },
    });
    const res = await POST(request("t=1,v1=sig"));
    expect(res.status).toBe(200);
    expect(constructStripeWebhookEvent).toHaveBeenCalledWith("{}", "t=1,v1=sig");
    expect(markDepositPaidByReference).toHaveBeenCalledWith("pi_123");
  });

  it("rejects requests without a signature header", async () => {
    expect((await POST(request())).status).toBe(400);
    expect(constructStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("returns 400 when Stripe rejects the signature", async () => {
    constructStripeWebhookEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });
    const res = await POST(request("t=1,v1=forged"));
    expect(res.status).toBe(400);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("ignores other event types", async () => {
    constructStripeWebhookEvent.mockReturnValue({ type: "charge.refunded", data: { object: { id: "ch_1" } } });
    expect((await POST(request("sig"))).status).toBe(200);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });
});
