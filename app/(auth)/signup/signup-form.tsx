"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, type SignUpState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, MailCheck, ShieldCheck } from "lucide-react";

const initialState: SignUpState = {};

export function SignUpForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [consented, setConsented] = useState(false);

  if (state?.needsEmailConfirmation) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <MailCheck className="h-10 w-10 text-gold" />
        <p className="font-display text-lg text-foreground">Check your inbox</p>
        <p className="text-sm text-muted">
          We&apos;ve sent a confirmation link to your email. Once confirmed, sign in
          to enter your garage.
        </p>
        <Button variant="secondary" className="mt-2" onClick={() => router.push("/login")}>
          Go to sign in
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required autoComplete="name" />
          {state?.fieldErrors?.fullName ? (
            <p className="text-xs text-danger">{state.fieldErrors.fullName}</p>
          ) : null}
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
          {state?.fieldErrors?.phone ? (
            <p className="text-xs text-danger">{state.fieldErrors.phone}</p>
          ) : null}
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
          {state?.fieldErrors?.email ? (
            <p className="text-xs text-danger">{state.fieldErrors.email}</p>
          ) : null}
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
          />
          {state?.fieldErrors?.password ? (
            <p className="text-xs text-danger">{state.fieldErrors.password}</p>
          ) : null}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background-elevated p-4">
        <input
          type="checkbox"
          name="consent"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold)]"
        />
        <span className="text-xs leading-relaxed text-muted">
          <ShieldCheck className="mb-1 inline h-3.5 w-3.5 text-gold" /> I understand
          my detailer wears a Meta smart-glasses camera to document each
          appointment, and I can opt to blur my face. Read the full{" "}
          <Link href="/disclaimer" target="_blank" className="text-gold-bright hover:underline">
            recording &amp; privacy disclaimer
          </Link>
          .
        </span>
      </label>
      {state?.fieldErrors?.consent ? (
        <p className="-mt-3 text-xs text-danger">{state.fieldErrors.consent}</p>
      ) : null}

      {state?.error ? (
        <p className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
