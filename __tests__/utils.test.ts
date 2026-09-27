import { describe, expect, it } from "vitest";
import { cn, formatCents } from "@/lib/utils";
import { getBodyStyle } from "@/lib/vehicle-silhouette";

describe("formatCents", () => {
  it("drops .00 for whole amounts and keeps cents otherwise", () => {
    expect(formatCents(150_000)).toBe("$1,500");
    expect(formatCents(150_050)).toBe("$1,500.50");
  });

  it("supports other currencies", () => {
    expect(formatCents(2_500, "EUR")).toBe("€25");
  });
});

describe("cn", () => {
  it("merges conflicting Tailwind classes, last one wins", () => {
    expect(cn("px-2 py-1", false && "hidden", "px-4")).toBe("py-1 px-4");
  });
});

describe("getBodyStyle", () => {
  it.each([
    ["Lamborghini Urus", "suv"],
    ["Rolls-Royce Cullinan", "suv"],
    ["Ferrari 296 GTS Spider", "convertible"],
    ["Bentley Continental GTC", "convertible"],
    ["Rolls-Royce Phantom", "sedan"],
    ["Porsche Taycan", "sedan"],
    ["McLaren 750S", "coupe"],
  ] as const)("%s → %s", (model, style) => {
    expect(getBodyStyle(model, "car")).toBe(style);
  });

  it("always returns jet for the jet catalog", () => {
    expect(getBodyStyle("Gulfstream G700", "jet")).toBe("jet");
  });
});
