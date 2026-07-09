import type { CatalogModel, HeroStyle } from "@/lib/types/domain";
import { ModelSelectCard } from "./model-select-card";

export function ModelGrid({
  models,
  brandName,
  brandHeroStyle,
  isAuthenticated,
}: {
  models: CatalogModel[];
  brandName: string;
  brandHeroStyle: HeroStyle;
  isAuthenticated: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelSelectCard
          key={model.id}
          catalogModelId={model.id}
          monogram={model.name.slice(0, 2).toUpperCase()}
          title={model.name}
          subtitle={model.model_year_range ?? brandName}
          heroStyle={model.hero_style?.from ? model.hero_style : brandHeroStyle}
          specs={model.specs}
          isAuthenticated={isAuthenticated}
          catalogType={model.type}
          imageUrl={model.image_url}
          imageAuthor={model.image_author}
          imageSourceUrl={model.image_source_url}
          imageLicense={model.image_license}
        />
      ))}
    </div>
  );
}
