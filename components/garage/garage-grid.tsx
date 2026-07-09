import type { GarageItem } from "@/lib/types/domain";
import { GarageItemCard } from "./garage-item-card";

export function GarageGrid({ items }: { items: GarageItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <GarageItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
