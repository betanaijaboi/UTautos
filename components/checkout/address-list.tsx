"use client";

import * as React from "react";
import { MapPin, Star, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddressManualForm } from "./address-manual-form";
import { deleteAddress } from "@/lib/actions/addresses";

export type AddressRow = {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

export function AddressList({
  addresses,
  selectable = false,
  selectedId,
  onSelect,
}: {
  addresses: AddressRow[];
  selectable?: boolean;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null);

  async function handleDelete(id: string) {
    setPendingDelete(id);
    await deleteAddress(id);
    setPendingDelete(null);
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card
          key={address.id}
          onClick={() => selectable && onSelect?.(address.id)}
          className={
            selectable
              ? `cursor-pointer transition-colors ${
                  selectedId === address.id ? "border-gold" : "hover:border-border-hover"
                }`
              : undefined
          }
        >
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <MapPin className="h-4 w-4 text-gold-bright" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{address.label}</p>
                  {address.is_default ? (
                    <Badge variant="gold">
                      <Star className="h-3 w-3" /> Default
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                  {address.state} {address.postal_code}
                </p>
              </div>
            </div>
            {!selectable ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(address.id);
                }}
                disabled={pendingDelete === address.id}
                className="rounded-full p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                aria-label="Delete address"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </CardContent>
        </Card>
      ))}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <Button variant="outline" onClick={() => setAddOpen(true)} className="w-full">
          <Plus className="h-4 w-4" /> Add address
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an address</DialogTitle>
          </DialogHeader>
          <AddressManualForm onCreated={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
