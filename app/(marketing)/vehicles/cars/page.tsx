import { getBrands } from "@/lib/actions/catalog";
import { BrandGrid } from "@/components/vehicle/brand-grid";

export const metadata = {
  title: "Luxury Cars — UT Autos",
  description: "Browse Ferrari, Lamborghini, Rolls-Royce, Bentley, Porsche, McLaren, and more — book mobile detailing for your marque.",
  alternates: { canonical: "/vehicles/cars" },
};

export default async function CarsPage() {
  const brands = await getBrands("car");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        The Fleet
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Choose your marque.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Select a brand to see current models. Choosing one for the first time
        adds it straight to your garage.
      </p>
      <div className="mt-12">
        <BrandGrid brands={brands} type="car" />
      </div>
    </div>
  );
}
