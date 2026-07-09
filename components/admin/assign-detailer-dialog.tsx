"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { assignDetailer } from "@/lib/actions/admin-bookings";

export function AssignDetailerDialog({
  bookingId,
  detailers,
}: {
  bookingId: string;
  detailers: { id: string; full_name: string | null }[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleAssign(detailerId: string) {
    setPending(true);
    const result = await assignDetailer(bookingId, detailerId);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error ?? "Couldn't assign detailer");
      return;
    }
    toast.success("Detailer assigned — booking mobilized.");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <UserCog className="h-4 w-4" /> Assign Detailer
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign a detailer</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {detailers.length === 0 ? (
              <p className="text-sm text-muted">No detailer accounts yet.</p>
            ) : (
              detailers.map((d) => (
                <button
                  key={d.id}
                  disabled={pending}
                  onClick={() => handleAssign(d.id)}
                  className="w-full rounded-lg border border-border bg-background-elevated px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-gold/50 disabled:opacity-50"
                >
                  {d.full_name ?? "Unnamed detailer"}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
