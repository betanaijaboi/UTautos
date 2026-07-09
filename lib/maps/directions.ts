import { isGoogleMapsConfigured } from "@/lib/config/feature-flags";

export function isDirectionsAvailable() {
  return isGoogleMapsConfigured();
}

export function googleMapsDirectionsUrl(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
}
