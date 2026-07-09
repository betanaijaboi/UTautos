import { Camera, EyeOff, ShieldCheck, FileCheck2 } from "lucide-react";
import { DISCLAIMER_SECTIONS } from "@/lib/config/disclaimer";

const ICONS = [Camera, EyeOff, ShieldCheck, FileCheck2];

export function DisclaimerContent({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-4" : "space-y-8"}>
      {DISCLAIMER_SECTIONS.map((section, i) => {
        const Icon = ICONS[i];
        return (
          <div key={section.title} className="flex gap-4">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
              <Icon className="h-4 w-4 text-gold-bright" />
            </div>
            <div>
              <h3 className={compact ? "text-sm font-medium text-foreground" : "font-display text-lg font-medium text-foreground"}>
                {section.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{section.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
