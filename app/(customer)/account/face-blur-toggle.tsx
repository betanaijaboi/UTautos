"use client";

import * as React from "react";
import { toast } from "sonner";
import { updateDefaultFaceBlur } from "@/lib/actions/account";

export function FaceBlurToggle({ initialValue }: { initialValue: boolean }) {
  const [value, setValue] = React.useState(initialValue);
  const [pending, setPending] = React.useState(false);

  async function handleToggle() {
    const next = !value;
    setValue(next);
    setPending(true);
    const result = await updateDefaultFaceBlur(next);
    setPending(false);
    if (!result.ok) {
      setValue(!next);
      toast.error("Couldn't update your preference.");
      return;
    }
    toast.success(next ? "Face blurring enabled by default." : "Face blurring disabled by default.");
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        value ? "bg-gold" : "bg-border"
      } disabled:opacity-50`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
