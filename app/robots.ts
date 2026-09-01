import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utautos.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/addresses",
        "/bookings",
        "/checkout",
        "/garage",
        "/admin",
        "/detailer",
        "/api",
        "/auth/callback",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
