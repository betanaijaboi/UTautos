import { createClient } from "@/lib/supabase/server";
import type { CatalogBrand, CatalogModel } from "@/lib/types/domain";

export type CatalogType = "car" | "jet";

export async function getBrands(type: CatalogType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_brands")
    .select("*")
    .eq("type", type)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data as unknown as CatalogBrand[];
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as unknown as CatalogBrand;
}

export async function getModelsByBrandSlug(slug: string) {
  const supabase = await createClient();
  const brand = await getBrandBySlug(slug);
  if (!brand) return { brand: null, models: [] as CatalogModel[] };

  const { data, error } = await supabase
    .from("catalog_models")
    .select("*")
    .eq("brand_id", brand.id)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return { brand, models: data as unknown as CatalogModel[] };
}

export async function getModelBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_models")
    .select("*, brand:catalog_brands(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as unknown as CatalogModel & { brand: CatalogBrand };
}
