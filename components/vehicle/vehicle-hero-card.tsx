"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { HeroStyle } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

export interface VehicleHeroCardProps {
  href: string;
  monogram: string;
  title: string;
  subtitle?: string | null;
  heroStyle: HeroStyle;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  aspect?: "square" | "wide";
  className?: string;
}

export function VehicleHeroCard({
  href,
  monogram,
  title,
  subtitle,
  heroStyle,
  badge,
  footer,
  aspect = "square",
  className,
}: VehicleHeroCardProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  const mouseXPct = useMotionValue(50);
  const mouseYPct = useMotionValue(50);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  const springX = useSpring(mouseXPct, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseYPct, { stiffness: 200, damping: 25 });
  const glowBackground = useMotionTemplate`radial-gradient(320px circle at ${springX}% ${springY}%, ${heroStyle.accent}33, transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseXPct.set(px * 100);
    mouseYPct.set(py * 100);
    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 14);
  }

  function handleEnter() {
    scale.set(1.03);
  }

  function handleLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <MotionLink
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border",
          aspect === "square" ? "aspect-[4/5]" : "aspect-[16/10]",
        )}
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `linear-gradient(155deg, ${heroStyle.from} 0%, ${heroStyle.to} 100%)`,
          }}
        />

        {/* Mouse-follow glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBackground }}
        />

        {/* Gradient border glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 0 1px ${heroStyle.accent}66, 0 0 40px -8px ${heroStyle.accent}55`,
          }}
        />

        {/* Monogram watermark */}
        <div
          className="absolute -bottom-6 -right-4 select-none font-display text-[9rem] font-medium leading-none opacity-[0.06] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.1]"
          style={{ color: heroStyle.accent }}
        >
          {monogram}
        </div>

        {/* Crest emblem */}
        <div className="absolute left-5 top-5 z-10">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[8deg]"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${heroStyle.accent}29, transparent 70%)`,
              boxShadow: `inset 0 0 0 1px ${heroStyle.accent}88, inset 0 0 0 4px ${heroStyle.to}cc, inset 0 0 0 5px ${heroStyle.accent}44`,
            }}
          >
            <span
              className="font-display text-lg font-medium tracking-wide"
              style={{ color: heroStyle.accent }}
            >
              {monogram}
            </span>
          </div>
        </div>

        {/* Top badge */}
        {badge ? <div className="absolute right-4 top-4 z-10">{badge}</div> : null}

        {/* Content */}
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
          {footer ? <div className="mt-3">{footer}</div> : null}
        </div>
      </MotionLink>
    </motion.div>
  );
}
