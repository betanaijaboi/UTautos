import Link from "next/link";
import { BookingStatusBadge } from "./booking-status-badge";
import { formatCents } from "@/lib/utils";

const COLUMNS = [
  { key: "confirmed", label: "Ready to Assign" },
  { key: "detailer_assigned", label: "Assigned" },
  { key: "en_route", label: "En Route" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
] as const;

type BookingRow = {
  id: string;
  status: string;
  total_cents: number;
  scheduled_start: string | null;
  customer: { full_name: string | null } | null;
  garage_item: { catalog_model: { name: string; brand: { name: string } } };
  detailer: { full_name: string | null } | null;
};

export function BookingQueue({ bookings }: { bookings: BookingRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {COLUMNS.map((col) => {
        const items = bookings.filter((b) => b.status === col.key);
        return (
          <div key={col.key}>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
              {col.label} <span className="text-gold">{items.length}</span>
            </p>
            <div className="space-y-3">
              {items.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-hover"
                >
                  <p className="text-sm font-medium text-foreground">
                    {b.garage_item.catalog_model.brand.name} {b.garage_item.catalog_model.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">{b.customer?.full_name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted">{formatCents(b.total_cents)}</span>
                    {b.detailer ? (
                      <span className="text-xs text-gold-bright">{b.detailer.full_name}</span>
                    ) : null}
                  </div>
                </Link>
              ))}
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
                  Nothing here
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
