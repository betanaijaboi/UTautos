import type { CatalogBrand, CatalogType } from "@/lib/types/domain";
import { VehicleHeroCard } from "./vehicle-hero-card";

export function BrandGrid({ brands, type }: { brands: CatalogBrand[]; type: CatalogType }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {brands.map((brand) => (
        <VehicleHeroCard
          key={brand.id}
          href={`/vehicles/${type === "car" ? "cars" : "jets"}/${brand.slug}`}
          monogram={brand.monogram}
          title={brand.name}
          subtitle={type === "car" ? "Luxury Automaker" : "Business Aviation"}
          heroStyle={brand.hero_style}
        />
      ))}
    </div>
  );
}
