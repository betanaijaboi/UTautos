import { getBrands } from "@/lib/actions/catalog";
import { BrandGrid } from "@/components/vehicle/brand-grid";

export const metadata = { title: "Private Jets — UT Autos" };

export default async function JetsPage() {
  const brands = await getBrands("jet");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        The Fleet
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Choose your aircraft manufacturer.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Select a manufacturer to see current models. Choosing one for the
        first time adds it straight to your garage.
      </p>
      <div className="mt-12">
        <BrandGrid brands={brands} type="jet" />
      </div>
    </div>
  );
}
