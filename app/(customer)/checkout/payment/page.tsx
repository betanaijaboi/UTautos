import { notFound } from "next/navigation";
import { getBookingDraft } from "@/lib/actions/checkout";
import { getPaymentProviders } from "@/lib/actions/payments";
import { PaymentStep } from "@/components/checkout/payment-step";
import { CartSummary } from "@/components/checkout/cart-summary";

export const metadata = {
  title: "Payment — UT Autos",
  robots: { index: false, follow: false },
};

export default async function CheckoutPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: bookingId } = await searchParams;
  if (!bookingId) notFound();

  const booking = await getBookingDraft(bookingId);
  if (!booking) notFound();

  const vehicleName = `${booking.garage_item.catalog_model.brand.name} ${booking.garage_item.catalog_model.name}`;
  const providers = await getPaymentProviders();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Secure Your Slot
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Pay your deposit
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        A 10% deposit confirms your booking and mobilizes your detailer. The
        remainder is due when the job is complete.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <PaymentStep
          bookingId={booking.id}
          depositCents={booking.deposit_cents}
          providers={providers}
        />
        <CartSummary
          vehicleName={vehicleName}
          services={booking.booking_services.map((bs: { service: { name: string; price_cents: number } }) => ({
            name: bs.service.name,
            price_cents: bs.service.price_cents,
          }))}
          subtotalCents={booking.subtotal_cents}
          depositCents={booking.deposit_cents}
        />
      </div>
    </div>
  );
}
