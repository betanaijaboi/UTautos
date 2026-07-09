import { getAddresses } from "@/lib/actions/addresses";
import { AddressList } from "@/components/checkout/address-list";
import { MapPin } from "lucide-react";

export const metadata = { title: "Addresses — UT Autos" };

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Where We Come To You
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Addresses
      </h1>
      <p className="mt-3 text-sm text-muted">
        Save the addresses where you'd like your detailer to meet you.
      </p>

      {addresses.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <MapPin className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">No addresses saved yet.</p>
        </div>
      ) : null}

      <div className="mt-10">
        <AddressList addresses={addresses} />
      </div>
    </div>
  );
}
