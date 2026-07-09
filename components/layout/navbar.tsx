import Link from "next/link";
import { getCurrentProfile } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { Logo } from "./logo";

function dashboardHref(role?: string) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "detailer") return "/detailer/dashboard";
  return "/garage";
}

export async function Navbar() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <Logo className="text-xl" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <Link href="/vehicles/cars" className="transition-colors hover:text-foreground">
            Cars
          </Link>
          <Link href="/vehicles/jets" className="transition-colors hover:text-foreground">
            Private Jets
          </Link>
          <Link href="/disclaimer" className="transition-colors hover:text-foreground">
            Disclaimer
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href={dashboardHref(profile.role)}>
                  {profile.role === "customer" ? "My Garage" : "Dashboard"}
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
