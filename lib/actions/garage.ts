"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { RemovalReason } from "@/lib/types/domain";

export type AddToGarageResult =
  | { ok: true; garageItemId: string; alreadyOwned: boolean }
  | { ok: false; error: string };

export async function addToGarage(catalogModelId: string): Promise<AddToGarageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "not_authenticated" };
  }

  const { data, error } = await supabase
    .from("garage_items")
    .insert({ customer_id: user.id, catalog_model_id: catalogModelId })
    .select("id")
    .single();

  if (error) {
    // 23505 = unique_violation — this model is already active in the garage.
    if (error.code === "23505") {
      const { data: existing } = await supabase
        .from("garage_items")
        .select("id")
        .eq("customer_id", user.id)
        .eq("catalog_model_id", catalogModelId)
        .eq("is_active", true)
        .single();

      if (existing) {
        return { ok: true, garageItemId: existing.id, alreadyOwned: true };
      }
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/garage");
  return { ok: true, garageItemId: data.id, alreadyOwned: false };
}

export async function getGarageItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("garage_items")
    .select("*, catalog_model:catalog_models(*, brand:catalog_brands(*))")
    .eq("customer_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as import("@/lib/types/domain").GarageItem[];
}

export type SoftDeleteResult = { ok: true } | { ok: false; error: string };

export async function softDeleteGarageItem(
  garageItemId: string,
  reason: RemovalReason,
  note?: string,
): Promise<SoftDeleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "not_authenticated" };
  }

  const { error } = await supabase
    .from("garage_items")
    .update({
      is_active: false,
      removed_at: new Date().toISOString(),
      removed_reason: reason,
      removed_reason_note: reason === "other" ? note ?? null : null,
    })
    .eq("id", garageItemId)
    .eq("customer_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/garage");
  return { ok: true };
}
