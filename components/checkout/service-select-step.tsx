"use client";

import { Check, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  is_express: boolean;
};

export function ServiceSelectStep({
  services,
  selectedIds,
  onToggle,
  expressSelected,
  onToggleExpress,
}: {
  services: ServiceRow[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  expressSelected: boolean;
  onToggleExpress: () => void;
}) {
  const standard = services.filter((s) => !s.is_express);
  const express = services.find((s) => s.is_express);

  return (
    <div className="space-y-3">
      {standard.map((service) => {
        const selected = selectedIds.includes(service.id);
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onToggle(service.id)}
            className={cn(
              "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
              selected
                ? "border-gold bg-gold/5"
                : "border-border bg-background-elevated hover:border-border-hover",
            )}
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  selected ? "border-gold bg-gold text-[#151107]" : "border-border",
                )}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : null}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{service.name}</p>
                {service.description ? (
                  <p className="mt-0.5 text-xs text-muted">{service.description}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted">{service.duration_minutes} min</p>
              </div>
            </div>
            <p className="whitespace-nowrap text-sm font-medium text-gold-bright">
              {formatCents(service.price_cents)}
            </p>
          </button>
        );
      })}

      {express ? (
        <button
          type="button"
          onClick={onToggleExpress}
          className={cn(
            "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
            expressSelected
              ? "border-gold bg-gold/10"
              : "border-dashed border-gold/40 bg-gold/5 hover:border-gold/60",
          )}
        >
          <div className="flex gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                expressSelected ? "border-gold bg-gold text-[#151107]" : "border-gold/40",
              )}
            >
              {expressSelected ? <Check className="h-3.5 w-3.5" /> : null}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{express.name}</p>
                <Badge variant="gold">
                  <Phone className="h-3 w-3" /> Phone Only
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted">{express.description}</p>
            </div>
          </div>
          <p className="whitespace-nowrap text-sm font-medium text-gold-bright">
            {formatCents(express.price_cents)}
          </p>
        </button>
      ) : null}
    </div>
  );
}
