import { MapPin, Navigation } from "lucide-react";

type LatLng = { lat: number; lng: number };

export function DetailerTrailMap({
  address,
  detailerLocation,
}: {
  address: { line1: string; city: string; state: string; postal_code: string; lat?: number | null; lng?: number | null };
  detailerLocation?: LatLng | null;
}) {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isConfigured = !!mapsKey && !mapsKey.includes("REPLACE_ME");
  const destinationQuery = encodeURIComponent(
    `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`,
  );

  if (isConfigured && detailerLocation) {
    const src = `https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${detailerLocation.lat},${detailerLocation.lng}&destination=${destinationQuery}&mode=driving`;
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe title="Route to customer" src={src} className="h-72 w-full" loading="lazy" />
      </div>
    );
  }

  if (isConfigured) {
    const src = `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${destinationQuery}`;
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe title="Customer location" src={src} className="h-72 w-full" loading="lazy" />
      </div>
    );
  }

  return (
    <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-background-elevated p-6 text-center">
      <MapPin className="h-8 w-8 text-muted" />
      <p className="text-sm text-foreground">
        {address.line1}, {address.city}, {address.state} {address.postal_code}
      </p>
      <p className="text-xs text-muted">
        Live map preview requires a Google Maps API key. Add
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the route trail.
      </p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${destinationQuery}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-bright hover:underline"
      >
        <Navigation className="h-3.5 w-3.5" /> Open in Google Maps
      </a>
    </div>
  );
}
