"use client";

import { useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalDocument } from "@/components/legal/legal-document";
import { TERMS_DOC, PRIVACY_DOC } from "@/lib/config/legal";

interface TermsGateModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function TermsGateModal({ onAccept, onDecline }: TermsGateModalProps) {
  const [reachedEnd, setReachedEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 24) setReachedEnd(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background-elevated shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-medium text-foreground">
            Terms of Service &amp; Privacy Policy
          </h2>
          <button
            type="button"
            onClick={onDecline}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable document */}
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-6">
          <LegalDocument doc={TERMS_DOC} />
          <div className="my-8 border-t border-border" />
          <LegalDocument doc={PRIVACY_DOC} />
          <p className="pb-4 pt-8 text-center text-xs text-muted">— End of documents —</p>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 flex-col gap-3 border-t border-border px-6 py-4">
          {!reachedEnd && (
            <p className="text-center text-xs text-muted">
              Scroll to the end of both documents to enable Agree.
            </p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onDecline}>
              Decline
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={onAccept}
              disabled={!reachedEnd}
            >
              <CheckCircle2 className="h-4 w-4" />
              I Agree
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
