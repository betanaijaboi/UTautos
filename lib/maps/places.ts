import { isGoogleMapsConfigured } from "@/lib/config/feature-flags";

export function isPlacesAutocompleteAvailable() {
  return isGoogleMapsConfigured();
}

export function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("client only"));
  if (!isGoogleMapsConfigured()) return Promise.reject(new Error("Google Maps not configured"));

  const w = window as unknown as { google?: unknown };
  if (w.google) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}
