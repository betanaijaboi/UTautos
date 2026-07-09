"use client";

import * as React from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmDevPayment } from "@/lib/actions/payments";
import type { PaymentProviderId } from "@/lib/payments/types";
import { formatCents } from "@/lib/utils";

export function DevModeSimulatePayment({
  bookingId,
  provider,
  depositCents,
  onConfirmed,
}: {
  bookingId: string;
  provider: PaymentProviderId;
  depositCents: number;
  onConfirmed: () => void;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSimulate() {
    setPending(true);
    setError(null);
    const result = await confirmDevPayment(bookingId, provider);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onConfirmed();
  }

  return (
    <div className="rounded-xl border border-dashed border-gold/40 bg-gold/5 p-5">
      <div className="mb-2 flex items-center gap-2 text-gold-bright">
        <FlaskConical className="h-4 w-4" />
        <p className="text-sm font-semibold">Test Mode</p>
      </div>
      <p className="text-sm text-muted">
        No live {provider.replace("_", " ")} credentials are configured yet, so this
        deposit will be simulated rather than charged for real. Once real API
        keys are added, this exact flow switches to the live provider
        automatically.
      </p>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <Button className="mt-4" onClick={handleSimulate} disabled={pending}>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `Simulate ${formatCents(depositCents)} deposit`
        )}
      </Button>
    </div>
  );
}
