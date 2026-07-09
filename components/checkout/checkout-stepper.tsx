"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCents, cn } from "@/lib/utils";
import {
  createDraftBooking,
  setBookingServices,
  setBookingAddress,
  setBookingSchedule,
  setBookingFaceBlur,
} from "@/lib/actions/checkout";
import { recordCheckoutConsent } from "@/lib/actions/account";
import { ServiceSelectStep, type ServiceRow } from "./service-select-step";
import { ExpressCta } from "./express-cta";
import { AddressStep } from "./address-step";
import { ScheduleStep } from "./schedule-step";
import { CartSummary } from "./cart-summary";
import type { AddressRow } from "./address-list";

const STEPS = ["Services", "Address", "Schedule", "Review"] as const;

export function CheckoutStepper({
  garageItemId,
  vehicleName,
  services,
  addresses,
  defaultFaceBlur,
}: {
  garageItemId: string;
  vehicleName: string;
  services: ServiceRow[];
  addresses: AddressRow[];
  defaultFaceBlur: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [bookingId, setBookingId] = React.useState<string | null>(null);
  const [initializing, setInitializing] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>([]);
  const [expressSelected, setExpressSelected] = React.useState(false);
  const [addressId, setAddressId] = React.useState<string | undefined>(
    addresses.find((a) => a.is_default)?.id,
  );
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("10:00");
  const [faceBlur, setFaceBlur] = React.useState(defaultFaceBlur);
  const [consented, setConsented] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const result = await createDraftBooking(garageItemId);
      if (result.ok) {
        setBookingId(result.bookingId);
      } else {
        toast.error("Couldn't start checkout — try again.");
      }
      setInitializing(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garageItemId]);

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price_cents, 0);
  const deposit = Math.round(subtotal * 0.1);
  const selectedAddress = addresses.find((a) => a.id === addressId);

  function toggleService(id: string) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  async function handleContinue() {
    if (!bookingId) return;
    setSaving(true);
    try {
      if (step === 0) {
        if (selectedServiceIds.length === 0 && !expressSelected) {
          toast.error("Select at least one service to continue.");
          return;
        }
        const result = await setBookingServices(bookingId, selectedServiceIds);
        if (!result.ok) {
          toast.error("Couldn't save your services — try again.");
          return;
        }
      }
      if (step === 1) {
        if (!addressId) {
          toast.error("Select or add an address to continue.");
          return;
        }
        const result = await setBookingAddress(bookingId, addressId);
        if (!result.ok) {
          toast.error("Couldn't save your address — try again.");
          return;
        }
      }
      if (step === 2) {
        if (!date || !time) {
          toast.error("Choose a date and time to continue.");
          return;
        }
        const scheduledStart = new Date(`${date}T${time}`).toISOString();
        const scheduledEnd = new Date(
          new Date(scheduledStart).getTime() + 90 * 60_000,
        ).toISOString();
        const result = await setBookingSchedule(bookingId, scheduledStart, scheduledEnd);
        if (!result.ok) {
          toast.error("Couldn't save your schedule — try again.");
          return;
        }
      }
      if (step === 3) {
        if (!consented) {
          toast.error("Please acknowledge the recording disclaimer to continue.");
          return;
        }
        await setBookingFaceBlur(bookingId, faceBlur);
        const consentResult = await recordCheckoutConsent(bookingId);
        if (!consentResult.ok) {
          toast.error("Couldn't record your consent — try again.");
          return;
        }
        router.push(`/checkout/payment?booking=${bookingId}`);
        return;
      }
      setStep((s) => s + 1);
    } finally {
      setSaving(false);
    }
  }

  if (initializing) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                    i === step
                      ? "border-gold bg-gold text-[#151107]"
                      : i < step
                        ? "border-gold/50 bg-gold/10 text-gold-bright"
                        : "border-border text-muted",
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    i === step ? "text-foreground" : "text-muted",
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 ? (
                <div className="h-px w-6 bg-border sm:w-10" />
              ) : null}
            </React.Fragment>
          ))}
        </div>

        {step === 0 ? (
          <ServiceSelectStep
            services={services}
            selectedIds={selectedServiceIds}
            onToggle={toggleService}
            expressSelected={expressSelected}
            onToggleExpress={() => setExpressSelected((v) => !v)}
          />
        ) : null}

        {step === 0 && expressSelected ? (
          <div className="mt-4">
            <ExpressCta
              price={formatCents(services.find((s) => s.is_express)?.price_cents ?? 0)}
            />
          </div>
        ) : null}

        {step === 1 ? (
          <AddressStep addresses={addresses} selectedId={addressId} onSelect={setAddressId} />
        ) : null}

        {step === 2 ? (
          <ScheduleStep date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background-elevated p-4 text-sm">
              <p className="text-muted">Vehicle</p>
              <p className="text-foreground">{vehicleName}</p>
            </div>
            <div className="rounded-xl border border-border bg-background-elevated p-4 text-sm">
              <p className="text-muted">Address</p>
              <p className="text-foreground">
                {selectedAddress
                  ? `${selectedAddress.line1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postal_code}`
                  : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background-elevated p-4 text-sm">
              <p className="text-muted">Scheduled for</p>
              <p className="text-foreground">
                {date && time
                  ? new Date(`${date}T${time}`).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={faceBlur}
                  onChange={(e) => setFaceBlur(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold)]"
                />
                <span className="text-sm text-foreground">
                  <EyeOff className="mb-0.5 inline h-3.5 w-3.5 text-gold" /> Blur my
                  face on this appointment's smart-glasses recording.
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-border bg-background-elevated p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold)]"
                />
                <span className="text-xs leading-relaxed text-muted">
                  <ShieldCheck className="mb-0.5 inline h-3.5 w-3.5 text-gold" /> I
                  understand my detailer wears a Meta smart-glasses camera to
                  document this appointment, and I must start my vehicle in view of
                  it. Read the full{" "}
                  <Link href="/disclaimer" target="_blank" className="text-gold-bright hover:underline">
                    recording &amp; privacy disclaimer
                  </Link>
                  .
                </span>
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || saving}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={
              saving ||
              (step === 0 && expressSelected && selectedServiceIds.length === 0) ||
              (step === 3 && !consented)
            }
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : step === 3 ? (
              "Continue to Payment"
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div>
        <CartSummary
          vehicleName={vehicleName}
          services={selectedServices}
          subtotalCents={subtotal}
          depositCents={deposit}
        />
      </div>
    </div>
  );
}
