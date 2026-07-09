"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Check, Loader2, Plus } from "lucide-react";
import type { HeroStyle } from "@/lib/types/domain";
import { addToGarage } from "@/lib/actions/garage";
import { cn } from "@/lib/utils";
import { getBodyStyle } from "@/lib/vehicle-silhouette";
import { VehicleSilhouette } from "./vehicle-silhouette";

export interface ModelSelectCardProps {
  catalogModelId: string;
  monogram: string;
  title: string;
  subtitle?: string | null;
  heroStyle: HeroStyle;
  specs?: Record<string, string>;
  isAuthenticated: boolean;
  catalogType?: "car" | "jet";
  imageUrl?: string | null;
  imageAuthor?: string | null;
  imageSourceUrl?: string | null;
  imageLicense?: string | null;
}

export function ModelSelectCard({
  catalogModelId,
  monogram,
  title,
  subtitle,
  heroStyle,
  specs,
  isAuthenticated,
  catalogType = "car",
  imageUrl,
  imageAuthor,
  imageSourceUrl,
  imageLicense,
}: ModelSelectCardProps) {
  const bodyStyle = getBodyStyle(title, catalogType);
  const router = useRouter();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "done">("idle");

  const mouseXPct = useMotionValue(50);
  const mouseYPct = useMotionValue(50);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  const springX = useSpring(mouseXPct, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseYPct, { stiffness: 200, damping: 25 });
  const glowBackground = useMotionTemplate`radial-gradient(320px circle at ${springX}% ${springY}%, ${heroStyle.accent}33, transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseXPct.set(px * 100);
    mouseYPct.set(py * 100);
    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 14);
  }

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/garage")}`);
      return;
    }
    if (status !== "idle") return;
    setStatus("loading");
    const result = await addToGarage(catalogModelId);
    if (!result.ok) {
      setStatus("idle");
      toast.error("Couldn't add that to your garage — try again.");
      return;
    }
    setStatus("done");
    toast.success(
      result.alreadyOwned ? `${title} is already in your garage.` : `${title} added to your garage.`,
    );
    setTimeout(() => router.push("/garage"), 700);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        ref={ref}
        type="button"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => scale.set(1.03)}
        onMouseLeave={() => {
          scale.set(1);
          rotateX.set(0);
          rotateY.set(0);
        }}
        onClick={handleClick}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border text-left"
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${heroStyle.to}00 0%, ${heroStyle.to}33 55%, ${heroStyle.to}ee 92%)`,
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
              style={{ background: `linear-gradient(155deg, ${heroStyle.from} 0%, ${heroStyle.to} 100%)` }}
            />
            <div
              className="absolute -bottom-6 -right-4 select-none font-display text-[7rem] font-medium leading-none opacity-[0.05] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08]"
              style={{ color: heroStyle.accent }}
            >
              {monogram}
            </div>
            {/* Vehicle cutout silhouette */}
            <div className="pointer-events-none absolute inset-x-0 top-[32%] flex justify-center px-8 text-white/90">
              <div
                className="absolute bottom-0 h-3 w-[65%] rounded-full blur-md"
                style={{ background: "black", opacity: 0.35 }}
              />
              <VehicleSilhouette
                bodyStyle={bodyStyle}
                className="relative w-full max-w-[210px] drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.06] group-hover:-translate-y-1"
              />
            </div>
          </>
        )}

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

        {/* Select affordance */}
        <div
          className={cn(
            "absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all",
            status === "done"
              ? "border-success/50 bg-success/20 text-success"
              : "border-white/20 bg-black/30 text-white/80 backdrop-blur group-hover:border-white/40 group-hover:bg-black/50",
          )}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === "done" ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          {subtitle ? (
            <p
              className="mb-1 text-[11px] font-medium uppercase tracking-widest opacity-80"
              style={{ color: heroStyle.accent }}
            >
              {subtitle}
            </p>
          ) : null}
          <h3 className="font-display text-xl font-medium leading-tight text-white drop-shadow-sm">
            {title}
          </h3>
          {specs ? (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/70">
              {Object.entries(specs).map(([k, v]) => (
                <span key={k}>
                  {v} <span className="text-white/40">{k}</span>
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/60 opacity-0 transition-opacity group-hover:opacity-100">
            {isAuthenticated ? "Add to my garage" : "Sign in to add"}
          </p>
        </div>

        {imageUrl && imageAuthor ? (
          <a
            href={imageSourceUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-1.5 left-2 z-10 text-[9px] text-white/40 opacity-0 transition-opacity hover:text-white/70 group-hover:opacity-100"
          >
            Photo: {imageAuthor} ({imageLicense})
          </a>
        ) : null}
      </motion.button>
    </motion.div>
  );
}
