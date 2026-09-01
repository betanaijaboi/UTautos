import type { MetadataRoute } from "next";
import { getBrands } from "@/lib/actions/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utautos.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [carBrands, jetBrands] = await Promise.all([
    getBrands("car").catch(() => []),
    getBrands("jet").catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/vehicles/cars`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/vehicles/jets`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const carRoutes: MetadataRoute.Sitemap = carBrands.map((b) => ({
    url: `${SITE_URL}/vehicles/cars/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const jetRoutes: MetadataRoute.Sitemap = jetBrands.map((b) => ({
    url: `${SITE_URL}/vehicles/jets/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...carRoutes, ...jetRoutes];
}
