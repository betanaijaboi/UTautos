import { Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpressCta({ price }: { price: string }) {
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1-555-0100";
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "UT Autos";

  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
      <div className="mb-3 flex items-center gap-2 text-gold-bright">
        <Clock className="h-5 w-5" />
        <p className="text-sm font-semibold uppercase tracking-wide">
          Express — Phone Only
        </p>
      </div>
      <p className="text-sm text-muted">
        Express ({price}) is our fastest tier — a detailer mobilizes within{" "}
        <span className="text-foreground">5 hours</span> of your call, no
        appointment needed. Because timing is everything, Express can only be
        booked by calling {businessName} directly — it can't be completed
        through online checkout.
      </p>
      <Button asChild className="mt-5 w-fit">
        <a href={`tel:${phone}`}>
          <Phone className="h-4 w-4" /> Call {phone} to book Express
        </a>
      </Button>
    </div>
  );
}
