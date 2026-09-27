import { beforeEach, describe, expect, it, vi } from "vitest";

// A tiny fake of the Supabase query builder: records every update and
// returns `payment` for the lookup.
let payment: { id: string; booking_id: string; status: string } | null;
let updates: Array<{ table: string; values: unknown; filters: Array<[string, unknown]> }>;

function fakeClient() {
  return {
    from(table: string) {
      return {
        select: () => ({
          eq: () => ({ single: async () => ({ data: payment, error: payment ? null : { message: "no rows" } }) }),
        }),
        update(values: unknown) {
          const entry = { table, values, filters: [] as Array<[string, unknown]> };
          updates.push(entry);
          const chain = {
            eq(col: string, val: unknown) {
              entry.filters.push([col, val]);
              return chain;
            },
          };
          return chain;
        },
      };
    },
  };
}

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => fakeClient() }));

const { markDepositPaidByReference } = await import("@/lib/payments/webhook-helpers");

beforeEach(() => {
  updates = [];
});

describe("markDepositPaidByReference", () => {
  it("marks the payment succeeded and confirms a pending booking", async () => {
    payment = { id: "pay_1", booking_id: "bk_1", status: "pending" };
    await markDepositPaidByReference("ref_123");

    expect(updates).toEqual([
      { table: "payments", values: { status: "succeeded" }, filters: [["id", "pay_1"]] },
      {
        table: "bookings",
        values: { status: "confirmed" },
        // Only a booking still awaiting payment is confirmed (never a cancelled one).
        filters: [["id", "bk_1"], ["status", "pending_payment"]],
      },
    ]);
  });

  it("is idempotent: a retried webhook for a paid payment changes nothing", async () => {
    payment = { id: "pay_1", booking_id: "bk_1", status: "succeeded" };
    await markDepositPaidByReference("ref_123");
    expect(updates).toEqual([]);
  });

  it("throws for an unknown reference", async () => {
    payment = null;
    await expect(markDepositPaidByReference("nope")).rejects.toThrow("No payment found for reference nope");
  });
});
