import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { getMyBookings } from "@/lib/actions/checkout";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { formatCents } from "@/lib/utils";

export const metadata = { title: "Bookings — UT Autos" };

export default async function BookingsPage() {
  const bookings = await getMyBookings();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Your History
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <CalendarClock className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">
            No bookings yet — pay a deposit at checkout to confirm your first one.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/bookings/${b.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-hover"
            >
              <div>
                <p className="font-medium text-foreground">
                  {b.garage_item.catalog_model.brand.name} {b.garage_item.catalog_model.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {b.scheduled_start
                    ? new Date(b.scheduled_start).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Unscheduled"}{" "}
                  · {formatCents(b.total_cents)}
                </p>
              </div>
              <BookingStatusBadge status={b.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
