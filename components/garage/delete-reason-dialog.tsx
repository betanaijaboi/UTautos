"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { softDeleteGarageItem } from "@/lib/actions/garage";
import type { RemovalReason } from "@/lib/types/domain";
import { AlertTriangle, Loader2 } from "lucide-react";

type Stage = "REASON_SELECT" | "OTHER_TEXT_INPUT" | "SUBMITTING" | "SYMPATHY_MESSAGE" | "ERROR";

const REASONS: { value: RemovalReason; label: string }[] = [
  { value: "sold", label: "I sold it" },
  { value: "accident", label: "I had an accident" },
  { value: "upgrade", label: "I got an upgrade" },
  { value: "none_of_your_business", label: "None of your business" },
  { value: "other", label: "Other" },
];

const SYMPATHY_MESSAGES: Record<RemovalReason, string> = {
  sold: "Congrats on the sale! We hope UT Autos was part of the journey.",
  accident: "We're so sorry to hear that. We hope everyone is okay.",
  upgrade: "Nice — enjoy the new ride. We hope to see it in your garage soon.",
  none_of_your_business: "Fair enough. It's your business, not ours.",
  other: "Thanks for letting us know. Sorry to see it go.",
};

export function DeleteReasonDialog({
  garageItemId,
  vehicleName,
  open,
  onOpenChange,
}: {
  garageItemId: string;
  vehicleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stage, setStage] = React.useState<Stage>("REASON_SELECT");
  const [reason, setReason] = React.useState<RemovalReason | null>(null);
  const [note, setNote] = React.useState("");

  function reset() {
    setStage("REASON_SELECT");
    setReason(null);
    setNote("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function selectReason(value: RemovalReason) {
    setReason(value);
    if (value === "other") {
      setStage("OTHER_TEXT_INPUT");
    } else {
      submit(value);
    }
  }

  async function submit(value: RemovalReason, noteValue?: string) {
    setStage("SUBMITTING");
    const result = await softDeleteGarageItem(garageItemId, value, noteValue);
    if (!result.ok) {
      setStage("ERROR");
      return;
    }
    setStage("SYMPATHY_MESSAGE");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {stage === "REASON_SELECT" ? (
          <>
            <DialogHeader>
              <DialogTitle>What happened??</DialogTitle>
              <DialogDescription>
                Removing <span className="text-foreground">{vehicleName}</span> from
                your garage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => selectReason(r.value)}
                  className="rounded-lg border border-border bg-background-elevated px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-gold/50 hover:bg-surface-hover"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {stage === "OTHER_TEXT_INPUT" ? (
          <>
            <DialogHeader>
              <DialogTitle>Tell us more</DialogTitle>
              <DialogDescription>Optional, but it helps us improve.</DialogDescription>
            </DialogHeader>
            <Textarea
              autoFocus
              rows={4}
              placeholder="What happened?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStage("REASON_SELECT")}>
                Back
              </Button>
              <Button
                size="sm"
                disabled={note.trim().length === 0}
                onClick={() => submit("other", note.trim())}
              >
                Continue
              </Button>
            </div>
          </>
        ) : null}

        {stage === "SUBMITTING" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
            <p className="text-sm text-muted">Removing from your garage…</p>
          </div>
        ) : null}

        {stage === "SYMPATHY_MESSAGE" && reason ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="font-display text-lg text-foreground">
              {SYMPATHY_MESSAGES[reason]}
            </p>
            <Button className="mt-2" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : null}

        {stage === "ERROR" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertTriangle className="h-6 w-6 text-danger" />
            <p className="text-sm text-muted">
              Something went wrong removing this vehicle. Please try again.
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
              <Button size="sm" onClick={() => setStage("REASON_SELECT")}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
