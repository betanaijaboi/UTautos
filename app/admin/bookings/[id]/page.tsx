import { notFound } from "next/navigation";
import { getAdminBookingDetail, getDetailers } from "@/lib/actions/admin-bookings";
import { getLatestDetailerLocation } from "@/lib/actions/detailer";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { AssignDetailerDialog } from "@/components/admin/assign-detailer-dialog";
import { DetailerTrailMap } from "@/components/admin/detailer-trail-map";
import { Card, CardContent } from "@/components/ui/card";
import { formatCents } from "@/lib/utils";

export const metadata = {
  title: "Booking Detail — Admin — UT Autos",
  robots: { index: false, follow: false },
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [booking, detailers] = await Promise.all([getAdminBookingDetail(id), getDetailers()]);
  if (!booking) notFound();

  const detailerLocation = booking.detailer
    ? await getLatestDetailerLocation(booking.detailer.id)
    : null;

  const vehicleName = `${booking.garage_item.catalog_model.brand.name} ${booking.garage_item.catalog_model.name}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
            Booking
          </p>
          <h1 className="font-display text-3xl font-medium text-foreground">{vehicleName}</h1>
          <p className="mt-1 text-sm text-muted">{booking.customer?.full_name} · {booking.customer?.phone}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted">Services</p>
              <ul className="mt-2 space-y-1 text-sm">
                {booking.booking_services.map((bs: { id: string; service: { name: string }; price_cents_snapshot: number }) => (
                  <li key={bs.id} className="flex justify-between">
                    <span className="text-foreground">{bs.service.name}</span>
                    <span className="text-muted">{formatCents(bs.price_cents_snapshot)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-medium">
                <span className="text-gold-bright">Deposit paid</span>
                <span className="text-gold-bright">{formatCents(booking.deposit_cents)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted">Schedule</p>
              <p className="mt-1 text-sm text-foreground">
                {booking.scheduled_start
                  ? new Date(booking.scheduled_start).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })
                  : "—"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-muted">Detailer</p>
                {booking.status === "confirmed" ? (
                  <AssignDetailerDialog bookingId={booking.id} detailers={detailers} />
                ) : null}
              </div>
              <p className="mt-1 text-sm text-foreground">
                {booking.detailer?.full_name ?? "Not yet assigned"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">Route to Customer</p>
          {booking.address ? (
            <DetailerTrailMap address={booking.address} detailerLocation={detailerLocation} />
          ) : (
            <p className="text-sm text-muted">No address on file.</p>
          )}
        </div>
      </div>
    </div>
  );
}
