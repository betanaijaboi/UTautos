"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const addressSchema = z.object({
  label: z.string().trim().min(1).max(40),
  line1: z.string().trim().min(3, "Enter a street address"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Enter a city"),
  state: z.string().trim().min(1, "Enter a state/region"),
  postalCode: z.string().trim().min(1, "Enter a postal code"),
  country: z.string().trim().min(2).default("US"),
  isDefault: z.boolean().default(false),
});

export type AddressState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
};

export async function getAddresses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("customer_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAddress(
  _prev: AddressState,
  formData: FormData,
): Promise<AddressState> {
  const parsed = addressSchema.safeParse({
    label: formData.get("label") || "Home",
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "US",
    isDefault: formData.get("isDefault") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { label, line1, line2, city, state, postalCode, country, isDefault } = parsed.data;

  if (isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("customer_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    customer_id: user.id,
    label,
    line1,
    line2,
    city,
    state,
    postal_code: postalCode,
    country,
    is_default: isDefault,
  });

  if (error) return { error: error.message };

  revalidatePath("/addresses");
  return { ok: true };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", user.id);

  revalidatePath("/addresses");
  return { ok: !error };
}
