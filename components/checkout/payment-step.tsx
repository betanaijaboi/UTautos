"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMethodSelector } from "./payment-method-selector";
import { DevModeSimulatePayment } from "./dev-mode-simulate-payment";
import { BankTransferInstructions } from "./providers/bank-transfer-instructions";
import { beginPayment } from "@/lib/actions/payments";
import type { PaymentProviderId, PaymentProviderMeta } from "@/lib/payments/types";
import { formatCents } from "@/lib/utils";

export function PaymentStep({
  bookingId,
  depositCents,
  providers,
}: {
  bookingId: string;
  depositCents: number;
  providers: PaymentProviderMeta[];
}) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<PaymentProviderId | null>(null);
  const [mode, setMode] = React.useState<
    "idle" | "loading" | "dev" | "bank_transfer" | "redirect" | "confirmed"
  >("idle");

  async function handleSelect(provider: PaymentProviderId) {
    setSelected(provider);
    setMode("loading");
    const result = await beginPayment(bookingId, provider);
    if (!result.ok) {
      toast.error(result.error);
      setMode("idle");
      return;
    }
    if (result.mode === "redirect") {
      window.location.href = result.url;
      return;
    }
    setMode(result.mode === "client_secret" ? "dev" : result.mode);
  }

  function handleConfirmed() {
    setMode("confirmed");
    toast.success("Deposit confirmed — your detailer will be mobilized shortly.");
    setTimeout(() => router.push(`/bookings/${bookingId}`), 900);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Deposit due today: {formatCents(depositCents)}
        </p>
        <PaymentMethodSelector providers={providers} selected={selected} onSelect={handleSelect} />
      </div>

      {mode === "loading" ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing payment…
        </div>
      ) : null}

      {mode === "dev" && selected ? (
        <DevModeSimulatePayment
          bookingId={bookingId}
          provider={selected}
          depositCents={depositCents}
          onConfirmed={handleConfirmed}
        />
      ) : null}

      {mode === "bank_transfer" ? (
        <>
          <BankTransferInstructions depositCents={depositCents} />
          <Button variant="secondary" onClick={() => router.push(`/bookings/${bookingId}`)}>
            I've sent the transfer
          </Button>
        </>
      ) : null}

      {mode === "confirmed" ? (
        <div className="flex items-center gap-2 text-sm text-success">
          <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to your booking…
        </div>
      ) : null}
    </div>
  );
}
