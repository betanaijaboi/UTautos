import Link from "next/link";
import { Home, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        404
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm text-muted">
        This page doesn&apos;t exist — the vehicle or booking you&apos;re looking for may have moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/vehicles/cars">
            <Car className="h-4 w-4" />
            Browse the fleet
          </Link>
        </Button>
      </div>
    </div>
  );
}
