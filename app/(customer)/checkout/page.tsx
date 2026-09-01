import { notFound } from "next/navigation";
import { getGarageItemForCheckout, getServicesForType } from "@/lib/actions/checkout";
import { getAddresses } from "@/lib/actions/addresses";
import { getCurrentProfile } from "@/lib/actions/auth";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";

export const metadata = {
  title: "Checkout — UT Autos",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ garage?: string }>;
}) {
  const { garage } = await searchParams;
  if (!garage) notFound();

  const garageItem = await getGarageItemForCheckout(garage);
  if (!garageItem) notFound();

  const [services, addresses, profile] = await Promise.all([
    getServicesForType(garageItem.catalog_model.type),
    getAddresses(),
    getCurrentProfile(),
  ]);

  const vehicleName = `${garageItem.catalog_model.brand.name} ${garageItem.catalog_model.name}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Book a Detail
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        {vehicleName}
      </h1>

      <div className="mt-10">
        <CheckoutStepper
          garageItemId={garage}
          vehicleName={vehicleName}
          services={services}
          addresses={addresses}
          defaultFaceBlur={profile?.default_face_blur_opt_in ?? true}
        />
      </div>
    </div>
  );
}
