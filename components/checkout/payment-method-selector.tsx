"use client";

import { CreditCard, Smartphone, Landmark, Wallet, Building2 } from "lucide-react";
import type { PaymentProviderMeta } from "@/lib/payments/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  stripe: CreditCard,
  apple_pay: Smartphone,
  paystack: Wallet,
  paypal: Landmark,
  bank_transfer: Building2,
};

export function PaymentMethodSelector({
  providers,
  selected,
  onSelect,
}: {
  providers: PaymentProviderMeta[];
  selected: string | null;
  onSelect: (id: PaymentProviderMeta["id"]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {providers.map((p) => {
        const Icon = ICONS[p.id];
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
              active
                ? "border-gold bg-gold/5"
                : "border-border bg-background-elevated hover:border-border-hover",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                active ? "border-gold bg-gold/10 text-gold-bright" : "border-border text-muted",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{p.label}</p>
                {!p.configured && p.id !== "bank_transfer" ? (
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    Test Mode
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-muted">{p.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
