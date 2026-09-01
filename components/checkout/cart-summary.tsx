import { formatCents } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function CartSummary({
  vehicleName,
  services,
  subtotalCents,
  depositCents,
}: {
  vehicleName: string;
  services: { name: string; price_cents: number }[];
  subtotalCents: number;
  depositCents: number;
}) {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-gold">
          Order Summary
        </p>
        <p className="mt-1 font-display text-lg text-foreground">{vehicleName}</p>

        <div className="mt-4 space-y-2 border-t border-border pt-4">
          {services.length === 0 ? (
            <p className="text-sm text-muted">No services selected yet.</p>
          ) : (
            services.map((s) => (
              <div key={s.name} className="flex justify-between text-sm">
                <span className="text-muted">{s.name}</span>
                <span className="text-foreground">{formatCents(s.price_cents)}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="text-foreground">{formatCents(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gold-bright">Deposit due today (10%)</span>
            <span className="text-gold-bright">{formatCents(depositCents)}</span>
          </div>
          <p className="text-xs text-muted">
            Remainder ({formatCents(subtotalCents - depositCents)}) is due on
            completion. Deposits are non-refundable — they hold your
            detailer&apos;s time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
