import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModelsByBrandSlug } from "@/lib/actions/catalog";
import { getCurrentProfile } from "@/lib/actions/auth";
import { ModelGrid } from "@/components/vehicle/model-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const { brand } = await getModelsByBrandSlug(brandSlug);
  return { title: brand ? `${brand.name} — UT Autos` : "UT Autos" };
}

export default async function JetBrandPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const [{ brand, models }, profile] = await Promise.all([
    getModelsByBrandSlug(brandSlug),
    getCurrentProfile(),
  ]);

  if (!brand || brand.type !== "jet") notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Link
        href="/vehicles/jets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold-bright"
      >
        <ArrowLeft className="h-4 w-4" />
        All manufacturers
      </Link>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Business Aviation
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        {brand.name}
      </h1>
      <div className="mt-12">
        <ModelGrid
          models={models}
          brandName={brand.name}
          brandHeroStyle={brand.hero_style}
          isAuthenticated={!!profile}
        />
      </div>
    </div>
  );
}
