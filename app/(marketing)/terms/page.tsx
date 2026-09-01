import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LegalDocument } from "@/components/legal/legal-document";
import { TERMS_DOC } from "@/lib/config/legal";

export const metadata = {
  title: "Terms of Service — UT Autos",
  description: "The terms that govern booking mobile detailing for cars and private jets through UT Autos.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold-bright"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
      <LegalDocument doc={TERMS_DOC} />
    </div>
  );
}
