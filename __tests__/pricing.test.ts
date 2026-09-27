import { describe, expect, it } from "vitest";
import { calculateBookingTotals, DEPOSIT_PERCENT } from "@/lib/pricing";

describe("calculateBookingTotals", () => {
  it("sums services and takes a 10% deposit", () => {
    expect(DEPOSIT_PERCENT).toBe(10);
    expect(calculateBookingTotals([45_000, 120_000])).toEqual({
      subtotalCents: 165_000,
      depositCents: 16_500,
      totalCents: 165_000,
    });
  });

  it("rounds the deposit to the nearest cent", () => {
    expect(calculateBookingTotals([1_005]).depositCents).toBe(101); // 100.5 → 101
    expect(calculateBookingTotals([1_004]).depositCents).toBe(100); // 100.4 → 100
  });

  it("is all zeros with no services selected", () => {
    expect(calculateBookingTotals([])).toEqual({ subtotalCents: 0, depositCents: 0, totalCents: 0 });
  });
});
