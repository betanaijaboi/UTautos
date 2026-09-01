import { notFound } from "next/navigation";
import { MapPin, CalendarClock, Car } from "lucide-react";
import { getBookingDraft } from "@/lib/actions/checkout";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCents } from "@/lib/utils";

export const metadata = {
  title: "Booking Details — UT Autos",
  robots: { index: false, follow: false },
};

const STATUS_STEPS = [
  "pending_payment",
  "confirmed",
  "detailer_assigned",
  "en_route",
  "in_progress",
  "completed",
] as const;

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingDraft(id);
  if (!booking) notFound();

  const vehicleName = `${booking.garage_item.catalog_model.brand.name} ${booking.garage_item.catalog_model.name}`;
  const currentIndex = STATUS_STEPS.indexOf(booking.status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
            Booking
          </p>
          <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
            {vehicleName}
          </h1>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {booking.status !== "cancelled" ? (
        <div className="mt-10 flex items-center gap-1">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  i <= currentIndex ? "bg-gold" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex gap-3 p-5">
            <Car className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Services</p>
              <ul className="mt-1 space-y-1 text-sm text-foreground">
                {booking.booking_services.map((bs: { id: string; service: { name: string }; price_cents_snapshot: number }) => (
                  <li key={bs.id} className="flex justify-between gap-4">
                    <span>{bs.service.name}</span>
                    <span className="text-muted">{formatCents(bs.price_cents_snapshot)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-3 p-5">
            <MapPin className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Location</p>
              <p className="mt-1 text-sm text-foreground">
                {booking.address
                  ? `${booking.address.line1}, ${booking.address.city}, ${booking.address.state} ${booking.address.postal_code}`
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardContent className="flex gap-3 p-5">
            <CalendarClock className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Schedule</p>
              <p className="mt-1 text-sm text-foreground">
                {booking.scheduled_start
                  ? new Date(booking.scheduled_start).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background-elevated p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="text-foreground">{formatCents(booking.subtotal_cents)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-muted">Deposit paid</span>
          <span className="text-gold-bright">{formatCents(booking.deposit_cents)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-muted">Remainder due on completion</span>
          <span className="text-foreground">
            {formatCents(booking.subtotal_cents - booking.deposit_cents)}
          </span>
        </div>
      </div>
    </div>
  );
}
