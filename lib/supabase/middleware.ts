import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database.types";

type Role = "customer" | "detailer" | "admin";

const ROLE_PREFIXES: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/detailer", role: "detailer" },
  { prefix: "/garage", role: "customer" },
  { prefix: "/checkout", role: "customer" },
  { prefix: "/bookings", role: "customer" },
  { prefix: "/addresses", role: "customer" },
  { prefix: "/account", role: "customer" },
];

function dashboardFor(role: Role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "detailer") return "/detailer/dashboard";
  return "/garage";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const matched = ROLE_PREFIXES.find((r) => path.startsWith(r.prefix));

  if (matched) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile?.role ?? "customer") as Role;

    if (role !== matched.role) {
      const url = request.nextUrl.clone();
      url.pathname = dashboardFor(role);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
