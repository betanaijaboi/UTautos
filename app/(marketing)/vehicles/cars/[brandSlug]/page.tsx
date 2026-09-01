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
  if (!brand) return { title: "UT Autos" };

  return {
    title: `${brand.name} — UT Autos`,
    description: `Book mobile detailing for your ${brand.name} — a detailer comes to you.`,
    alternates: { canonical: `/vehicles/cars/${brandSlug}` },
  };
}

export default async function CarBrandPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const [{ brand, models }, profile] = await Promise.all([
    getModelsByBrandSlug(brandSlug),
    getCurrentProfile(),
  ]);

  if (!brand || brand.type !== "car") notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/vehicles/cars" className="flex items-center gap-1.5 transition-colors hover:text-gold-bright">
          <ArrowLeft className="h-4 w-4" />
          Cars
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-foreground">{brand.name}</span>
      </nav>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Luxury Automaker
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
