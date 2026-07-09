import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DisclaimerContent } from "@/components/legal/disclaimer-content";

export const metadata = {
  title: "Recording & Privacy Disclaimer — UT Autos",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold-bright"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Legal
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Recording &amp; Privacy Disclaimer
      </h1>
      <p className="mt-4 text-sm text-muted">
        Every UT Autos appointment involves documentation via smart-glasses camera.
        Here's exactly what that means for you.
      </p>
      <div className="mt-12">
        <DisclaimerContent />
      </div>
    </div>
  );
}
