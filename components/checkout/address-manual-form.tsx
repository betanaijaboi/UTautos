"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAddress, type AddressState } from "@/lib/actions/addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const initialState: AddressState = {};

export function AddressManualForm({ onCreated }: { onCreated?: () => void }) {
  const [state, formAction, pending] = useActionState(createAddress, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      onCreated?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" placeholder="Home" defaultValue="Home" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="line1">Street address</Label>
          <Input id="line1" name="line1" required placeholder="123 Ocean Drive" />
          {state?.fieldErrors?.line1 ? (
            <p className="text-xs text-danger">{state.fieldErrors.line1}</p>
          ) : null}
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="line2">Apt / Suite (optional)</Label>
          <Input id="line2" name="line2" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required />
          {state?.fieldErrors?.city ? (
            <p className="text-xs text-danger">{state.fieldErrors.city}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" required />
          {state?.fieldErrors?.state ? (
            <p className="text-xs text-danger">{state.fieldErrors.state}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" name="postalCode" required />
          {state?.fieldErrors?.postalCode ? (
            <p className="text-xs text-danger">{state.fieldErrors.postalCode}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue="US" required />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="isDefault" className="h-4 w-4 accent-[var(--gold)]" />
        Set as default address
      </label>

      {state?.error ? (
        <p className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save address"}
      </Button>
    </form>
  );
}
