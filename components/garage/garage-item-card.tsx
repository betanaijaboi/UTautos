"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { GarageItem } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { DeleteReasonDialog } from "./delete-reason-dialog";
import { getBodyStyle } from "@/lib/vehicle-silhouette";
import { VehicleSilhouette } from "@/components/vehicle/vehicle-silhouette";

export function GarageItemCard({ item }: { item: GarageItem }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const heroStyle = item.catalog_model.brand.hero_style;
  const model = item.catalog_model;
  const bodyStyle = getBodyStyle(model.name, model.type);

  const mouseXPct = useMotionValue(50);
  const mouseYPct = useMotionValue(50);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  const springX = useSpring(mouseXPct, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseYPct, { stiffness: 200, damping: 25 });
  const glowBackground = useMotionTemplate`radial-gradient(320px circle at ${springX}% ${springY}%, ${heroStyle.accent}33, transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseXPct.set(px * 100);
    mouseYPct.set(py * 100);
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 10);
  }

  return (
    <>
      <motion.div
        style={{ perspective: 1200 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => scale.set(1.02)}
          onMouseLeave={() => {
            scale.set(1);
            rotateX.set(0);
            rotateY.set(0);
          }}
          style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
          className="group relative overflow-hidden rounded-2xl border border-border"
        >
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            style={{ background: `linear-gradient(155deg, ${heroStyle.from} 0%, ${heroStyle.to} 100%)` }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glowBackground }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow: `inset 0 0 0 1px ${heroStyle.accent}66, 0 0 40px -8px ${heroStyle.accent}55`,
            }}
          />
          <div
            className="absolute -bottom-6 -right-4 select-none font-display text-[7rem] font-medium leading-none opacity-[0.05] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08]"
            style={{ color: heroStyle.accent }}
          >
            {model.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[24%] flex justify-center px-8 text-white/90">
            <div
              className="absolute bottom-0 h-3 w-[65%] rounded-full blur-md"
              style={{ background: "black", opacity: 0.35 }}
            />
            <VehicleSilhouette
              bodyStyle={bodyStyle}
              className="relative w-full max-w-[190px] drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.06] group-hover:-translate-y-1"
            />
          </div>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            aria-label="Remove from garage"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur transition-colors hover:border-danger/50 hover:bg-danger/20 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-5">
            <p
              className="mb-1 text-[11px] font-medium uppercase tracking-widest opacity-80"
              style={{ color: heroStyle.accent }}
            >
              {model.brand.name}
            </p>
            <h3 className="font-display text-xl font-medium leading-tight text-white drop-shadow-sm">
              {item.nickname || model.name}
            </h3>
            {item.nickname ? (
              <p className="mt-0.5 text-xs text-white/60">{model.name}</p>
            ) : null}
            <Button asChild size="sm" className="mt-4 w-fit">
              <Link href={`/checkout?garage=${item.id}`}>Book a Detail</Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <DeleteReasonDialog
        garageItemId={item.id}
        vehicleName={item.nickname || model.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
