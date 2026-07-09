export type HeroStyle = {
  from: string;
  to: string;
  accent: string;
};

export type CatalogType = "car" | "jet";

export type CatalogBrand = {
  id: string;
  type: CatalogType;
  name: string;
  slug: string;
  monogram: string;
  hero_style: HeroStyle;
  sort_order: number;
  is_active: boolean;
};

export type CatalogModel = {
  id: string;
  brand_id: string;
  type: CatalogType;
  name: string;
  slug: string;
  model_year_range: string | null;
  tagline: string | null;
  hero_style: HeroStyle;
  specs: Record<string, string>;
  sort_order: number;
  is_active: boolean;
  image_url: string | null;
  image_author: string | null;
  image_author_url: string | null;
  image_source_url: string | null;
  image_license: string | null;
};

export type RemovalReason =
  | "sold"
  | "accident"
  | "upgrade"
  | "none_of_your_business"
  | "other";

export type GarageItem = {
  id: string;
  customer_id: string;
  catalog_model_id: string;
  nickname: string | null;
  is_active: boolean;
  removed_at: string | null;
  removed_reason: RemovalReason | null;
  removed_reason_note: string | null;
  created_at: string;
  catalog_model: CatalogModel & { brand: CatalogBrand };
};
