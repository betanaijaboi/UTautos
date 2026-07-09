-- Real, licensed (Wikimedia Commons) vehicle photography, matched per model.
-- Falls back to a hand-drawn body-style silhouette in the UI when null.
alter table public.catalog_models
  add column if not exists image_url text,
  add column if not exists image_author text,
  add column if not exists image_author_url text,
  add column if not exists image_source_url text,
  add column if not exists image_license text;
