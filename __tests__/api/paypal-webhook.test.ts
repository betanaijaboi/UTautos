import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const markDepositPaidByReference = vi.fn();
vi.mock("@/lib/payments/webhook-helpers", () => ({ markDepositPaidByReference }));

const { POST } = await import("@/app/api/webhooks/paypal/route");

// PayPal API: OAuth token, then the verify-webhook-signature call.
let verificationStatus: string;
const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
  if (url.endsWith("/v1/oauth2/token")) {
    return new Response(JSON.stringify({ access_token: "tok" }), { status: 200 });
  }
  if (url.endsWith("/v1/notifications/verify-webhook-signature")) {
    const body = JSON.parse(String(init?.body));
    expect(body.webhook_id).toBe("WH-123");
    return new Response(JSON.stringify({ verification_status: verificationStatus }), { status: 200 });
  }
  throw new Error(`unexpected fetch ${url}`);
});

const paypalHeaders = {
  "paypal-auth-algo": "SHA256withRSA",
  "paypal-cert-url": "https://api.paypal.com/cert.pem",
  "paypal-transmission-id": "tx-1",
  "paypal-transmission-sig": "sig",
  "paypal-transmission-time": "2026-09-27T10:00:00Z",
};

const captureCompleted = {
  event_type: "PAYMENT.CAPTURE.COMPLETED",
  resource: { id: "CAPTURE-1", supplementary_data: { related_ids: { order_id: "ORDER-9" } } },
};

const request = (event: unknown, headers: Record<string, string> = paypalHeaders) =>
  new Request("http://localhost/api/webhooks/paypal", {
    method: "POST",
    body: JSON.stringify(event),
    headers,
  });

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_PAYPAL_CLIENT_ID", "client");
  vi.stubEnv("PAYPAL_CLIENT_SECRET", "secret");
  vi.stubEnv("PAYPAL_WEBHOOK_ID", "WH-123");
  vi.stubGlobal("fetch", fetchMock);
  verificationStatus = "SUCCESS";
  markDepositPaidByReference.mockReset();
  fetchMock.mockClear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/webhooks/paypal", () => {
  it("confirms the deposit (by order ID) for a verified capture", async () => {
    const res = await POST(request(captureCompleted));
    expect(res.status).toBe(200);
    expect(markDepositPaidByReference).toHaveBeenCalledWith("ORDER-9");
  });

  it("rejects an event PayPal doesn't verify (forged request)", async () => {
    verificationStatus = "FAILURE";
    const res = await POST(request(captureCompleted));
    expect(res.status).toBe(400);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("rejects a request without PayPal transmission headers, without calling PayPal", async () => {
    const res = await POST(request(captureCompleted, {}));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("does not confirm on ORDER.APPROVED (approval is not payment)", async () => {
    const res = await POST(request({ event_type: "CHECKOUT.ORDER.APPROVED", resource: { id: "ORDER-9" } }));
    expect(res.status).toBe(200);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("returns 503 when no webhook ID is configured", async () => {
    vi.stubEnv("PAYPAL_WEBHOOK_ID", "");
    const res = await POST(request(captureCompleted));
    expect(res.status).toBe(503);
    expect(markDepositPaidByReference).not.toHaveBeenCalled();
  });

  it("returns 400 for a body that isn't JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/webhooks/paypal", { method: "POST", body: "not json", headers: paypalHeaders })
    );
    expect(res.status).toBe(400);
  });
});
