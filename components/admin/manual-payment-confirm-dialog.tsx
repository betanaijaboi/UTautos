"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmManualPayment } from "@/lib/actions/admin-bookings";

export function ManualPaymentConfirmButton({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleConfirm() {
    setPending(true);
    const result = await confirmManualPayment(paymentId);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error ?? "Couldn't confirm payment");
      return;
    }
    toast.success("Payment confirmed — booking is now confirmed.");
    router.refresh();
  }

  return (
    <Button size="sm" onClick={handleConfirm} disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Received"}
    </Button>
  );
}
