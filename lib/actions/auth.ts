"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { DISCLAIMER_VERSION } from "@/lib/config/disclaimer";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  consent: z.literal(true, {
    error: "You must accept the recording & privacy disclaimer to continue",
  }),
});

export type SignUpState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  needsEmailConfirmation?: boolean;
};

export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const { fullName, phone, email, password } = parsed.data;
  const supabase = await createClient();

  // Phone + consent are written by the handle_new_user DB trigger (security
  // definer), not here — at this point there may be no session yet (email
  // confirmation pending), so a client-side write would be blocked by RLS.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        consent: true,
        disclaimer_version: DISCLAIMER_VERSION,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return { needsEmailConfirmation: true };
  }

  return {};
}

const logInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type LogInState = { error?: string };

export async function logIn(
  _prev: LogInState,
  formData: FormData,
): Promise<LogInState> {
  const parsed = logInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? { ...profile, email: user.email } : null;
}
