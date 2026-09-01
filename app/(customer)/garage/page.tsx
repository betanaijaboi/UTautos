import Link from "next/link";
import { Car, Plane } from "lucide-react";
import { getGarageItems } from "@/lib/actions/garage";
import { GarageGrid } from "@/components/garage/garage-grid";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Garage — UT Autos",
  robots: { index: false, follow: false },
};

export default async function GaragePage() {
  const items = await getGarageItems();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Your Collection
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        My Garage
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Every car and jet you&apos;ve selected lives here. Book a detail, or remove
        one you no longer own.
      </p>

      {items.length === 0 ? (
        <div className="mt-14 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
          <div className="flex gap-3 text-muted">
            <Car className="h-8 w-8" />
            <Plane className="h-8 w-8" />
          </div>
          <p className="font-display text-lg text-foreground">
            Your garage is empty.
          </p>
          <p className="max-w-sm text-sm text-muted">
            Browse our fleet and select a car or jet — it&apos;ll show up here
            automatically.
          </p>
          <div className="mt-2 flex gap-3">
            <Button asChild size="sm">
              <Link href="/vehicles/cars">Browse Cars</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/vehicles/jets">Browse Jets</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <GarageGrid items={items} />
        </div>
      )}
    </div>
  );
}
