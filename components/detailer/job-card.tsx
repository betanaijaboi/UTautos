"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { advanceBookingStatus } from "@/lib/actions/detailer";

const NEXT_LABEL: Record<string, string> = {
  detailer_assigned: "Start Driving (En Route)",
  en_route: "Arrived — Start Job",
  in_progress: "Mark Completed",
};

export function JobCard({
  booking,
}: {
  booking: {
    id: string;
    status: string;
    scheduled_start: string | null;
    customer: { full_name: string | null; phone: string | null } | null;
    address: { line1: string; city: string; state: string; postal_code: string } | null;
    garage_item: { catalog_model: { name: string; brand: { name: string } } };
  };
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const nextLabel = NEXT_LABEL[booking.status];

  async function handleAdvance() {
    setPending(true);
    const result = await advanceBookingStatus(booking.id);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error ?? "Couldn't update status");
      return;
    }
    toast.success("Status updated.");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-foreground">
            {booking.garage_item.catalog_model.brand.name} {booking.garage_item.catalog_model.name}
          </p>
          <p className="mt-1 text-sm text-muted">{booking.customer?.full_name}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {booking.address ? (
          <p className="flex items-center gap-2 text-muted">
            <MapPin className="h-4 w-4 shrink-0 text-gold" />
            {booking.address.line1}, {booking.address.city}, {booking.address.state}{" "}
            {booking.address.postal_code}
          </p>
        ) : null}
        {booking.customer?.phone ? (
          <p className="flex items-center gap-2 text-muted">
            <Phone className="h-4 w-4 shrink-0 text-gold" />
            {booking.customer.phone}
          </p>
        ) : null}
      </div>

      {nextLabel ? (
        <Button size="sm" className="mt-4" onClick={handleAdvance} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : nextLabel}
          {!pending ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>
      ) : null}
    </div>
  );
}
