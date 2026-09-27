/** Share of the service subtotal charged up front to confirm a booking. */
export const DEPOSIT_PERCENT = 10;

export type BookingTotals = {
  subtotalCents: number;
  depositCents: number;
  totalCents: number;
};

/** Totals for a booking from its selected services' prices (in cents). */
export function calculateBookingTotals(servicePricesCents: number[]): BookingTotals {
  const subtotalCents = servicePricesCents.reduce((sum, price) => sum + price, 0);
  const depositCents = Math.round((subtotalCents * DEPOSIT_PERCENT) / 100);
  return { subtotalCents, depositCents, totalCents: subtotalCents };
}
