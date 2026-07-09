import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-racing inline-flex items-baseline tracking-wide text-foreground",
        className,
      )}
    >
      <span>A</span>
      <span className="text-gold-bright text-[1.2em] leading-none">UT</span>
      <span>OS</span>
    </span>
  );
}
