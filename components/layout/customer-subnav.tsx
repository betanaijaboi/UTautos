"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/garage", label: "My Garage" },
  { href: "/bookings", label: "Bookings" },
  { href: "/addresses", label: "Addresses" },
  { href: "/account", label: "Account" },
];

export function CustomerSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border/60 bg-surface/30">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6">
        {LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition-colors",
                active
                  ? "border-gold text-foreground"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
