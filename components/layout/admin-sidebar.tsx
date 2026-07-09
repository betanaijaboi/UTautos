"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Bookings", icon: LayoutDashboard },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border/60 bg-surface/30">
      <div className="mx-auto flex max-w-7xl gap-1 px-6">
        {LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition-colors",
                active
                  ? "border-gold text-foreground"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
