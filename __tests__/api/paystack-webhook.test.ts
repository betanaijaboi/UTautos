import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const markDepositPaidByReference = vi.fn();
vi.mock("@/lib/payments/webhook-helpers", () => ({ markDepositPaidByReference }));

const { POST } = await import("@/app/api/webhooks/paystack/route");

const SECRET = "sk_test_realsecret";
const sign = (body: string, secret = SECRET) => createHmac("sha512", secret).update(body).digest("hex");
const request = (body: string, signature?: string) =>
  new Request("http://localhost/api/webhooks/paystack", {
    method: "POST",
    body,
    headers: signature ? { "x-paystack-signature": signature } : {},
  });

const chargeSuccess = JSON.stringify({ event: "charge.success", data: { reference: "ref_abc" } });

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY", "pk_test_real");
  vi.stubEnv("PAYSTACK_SECRET_KEY", SECRET);
  markDepositPaidByReference.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/webhooks/paystack", () => {
  it("confirms the deposit for a correctly signed charge.success", async () => {
    const res = await POST(request(chargeSuccess, sign(chargeSuccess)));
    expect(res.status).toBe(200);
    expect(markDepositPaidByReference).toHaveBeenCalledWith("ref_abc");
  });

  it("rejects a missing signature", async () => {
    const res = await POST(request(chargeSuccess));
    expect(res.status).toBe(400);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("rejects a signature made with the wrong key", async () => {
    const res = await POST(request(chargeSuccess, sign(chargeSuccess, "attacker-key")));
    expect(res.status).toBe(400);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("rejects a body that was tampered with after signing", async () => {
    const tampered = chargeSuccess.replace("ref_abc", "ref_other");
    const res = await POST(request(tampered, sign(chargeSuccess)));
    expect(res.status).toBe(400);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("acknowledges but ignores other event types", async () => {
    const body = JSON.stringify({ event: "transfer.success", data: { reference: "ref_abc" } });
    const res = await POST(request(body, sign(body)));
    expect(res.status).toBe(200);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("returns 503 when Paystack isn't configured", async () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");
    const res = await POST(request(chargeSuccess, sign(chargeSuccess)));
    expect(res.status).toBe(503);
  });
});
