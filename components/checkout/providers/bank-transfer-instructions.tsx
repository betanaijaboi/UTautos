import { Building2 } from "lucide-react";
import { formatCents } from "@/lib/utils";

export function BankTransferInstructions({ depositCents }: { depositCents: number }) {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "UT Autos Detailing";

  return (
    <div className="rounded-xl border border-border bg-background-elevated p-5">
      <div className="mb-3 flex items-center gap-2 text-foreground">
        <Building2 className="h-4 w-4 text-gold" />
        <p className="text-sm font-semibold">Bank Transfer Instructions</p>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Account name</dt>
          <dd className="text-foreground">{businessName} LLC</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Bank</dt>
          <dd className="text-foreground">First National Bank</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Account number</dt>
          <dd className="text-foreground">•••• •••• 4471</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Amount</dt>
          <dd className="font-medium text-gold-bright">{formatCents(depositCents)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted">
        Your booking will show as <span className="text-foreground">pending verification</span>{" "}
        until our team confirms your transfer — this is usually within a few
        hours. Your detailer isn't mobilized until then.
      </p>
    </div>
  );
}
