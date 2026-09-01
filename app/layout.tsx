import type { Metadata } from "next";
import { Inter, Fraunces, Racing_Sans_One } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const racingSansOne = Racing_Sans_One({
  variable: "--font-racing",
  subsets: ["latin"],
  weight: ["400"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utautos.vercel.app";
const SITE_TITLE = "UT Autos — Concierge Detailing for Cars & Private Jets";
const SITE_DESCRIPTION =
  "Mobile detailing for the world's finest cars and private jets. Book Ferrari, Lamborghini, Rolls-Royce, Bentley, Porsche, Gulfstream, Bombardier and more — a detailer comes to you.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "UT Autos",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 670 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "UT Autos Detailing",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE,
  priceRange: "$$$$",
  serviceType: "Mobile vehicle and aircraft detailing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${racingSansOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}
