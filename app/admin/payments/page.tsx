import { getPendingManualPayments } from "@/lib/actions/admin-bookings";
import { ManualPaymentConfirmButton } from "@/components/admin/manual-payment-confirm-dialog";
import { formatCents } from "@/lib/utils";
import { Landmark } from "lucide-react";

export const metadata = {
  title: "Payments — Admin — UT Autos",
  robots: { index: false, follow: false },
};

export default async function AdminPaymentsPage() {
  const payments = await getPendingManualPayments();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Manual Confirmation Queue
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground">
        Bank Transfer Payments
      </h1>

      {payments.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Landmark className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">No pending bank transfers to confirm.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {p.booking?.customer?.full_name ?? "Unknown customer"}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatCents(p.amount_cents)} · requested{" "}
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <ManualPaymentConfirmButton paymentId={p.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
