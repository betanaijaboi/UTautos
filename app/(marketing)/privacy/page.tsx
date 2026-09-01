import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LegalDocument } from "@/components/legal/legal-document";
import { PRIVACY_DOC } from "@/lib/config/legal";

export const metadata = {
  title: "Privacy Policy — UT Autos",
  description: "What UT Autos collects, why, who it's shared with, and your data rights under Nigeria's Data Protection Act.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold-bright"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
      <LegalDocument doc={PRIVACY_DOC} />
    </div>
  );
}
