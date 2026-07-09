"use client";

import { AddressList, type AddressRow } from "./address-list";

export function AddressStep({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: AddressRow[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <AddressList addresses={addresses} selectable selectedId={selectedId} onSelect={onSelect} />
  );
}
