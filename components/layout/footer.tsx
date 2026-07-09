import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5">
          <Logo className="text-base" /> — concierge detailing, wherever you are.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/vehicles/cars" className="hover:text-foreground">
            Cars
          </Link>
          <Link href="/vehicles/jets" className="hover:text-foreground">
            Private Jets
          </Link>
          <Link href="/disclaimer" className="hover:text-foreground">
            Recording &amp; Privacy Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
