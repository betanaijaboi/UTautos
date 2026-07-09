import Link from "next/link";
import { ArrowRight, Car, Plane, ShieldCheck, Timer, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CAR_BRANDS = [
  "Ferrari",
  "Lamborghini",
  "Rolls-Royce",
  "Bentley",
  "Porsche",
  "McLaren",
  "Aston Martin",
  "Mercedes-Maybach",
];

const JET_BRANDS = ["Gulfstream", "Bombardier", "Cessna Citation", "Embraer", "Dassault Falcon"];

const FEATURES = [
  {
    icon: Car,
    title: "Your Garage",
    body: "Every car and jet you select lives in your personal garage — one tap to rebook.",
  },
  {
    icon: Sparkles,
    title: "Full-service menu",
    body: "Full Detail, engine/cabin wash, body/hull wash, ceramic polishing, and more — priced per vehicle class.",
  },
  {
    icon: Timer,
    title: "Express, on demand",
    body: "Call and we mobilize within 5 hours — no appointment needed, for a premium.",
  },
  {
    icon: MapPin,
    title: "We come to you",
    body: "Enter your address once. Your detailer navigates straight to your door.",
  },
  {
    icon: ShieldCheck,
    title: "10% to lock it in",
    body: "A small deposit confirms your slot — we only mobilize a detailer once it clears.",
  },
  {
    icon: Plane,
    title: "Cars & private jets",
    body: "The same concierge standard, whether it's a Purosangue or a Gulfstream G700.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,161,90,0.15),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold-bright">
            <Sparkles className="h-3.5 w-3.5" />
            Concierge detailing, mobilized to you
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.1] text-foreground sm:text-6xl">
            The finest detailing for the finest{" "}
            <span className="italic text-gold-bright">machines.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg">
            Ferrari to Rolls-Royce, Gulfstream to Bombardier — select your vehicle,
            choose your service, and a detailer comes to you. Deposit-secured,
            fully insured, obsessively documented.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/vehicles/cars">
                Browse Cars <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/vehicles/jets">
                Browse Private Jets <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section className="border-y border-border/60 bg-surface/40 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm tracking-wide text-muted">
            {CAR_BRANDS.map((b) => (
              <span key={b} className="font-display italic">
                {b}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-widest text-muted/70">
            {JET_BRANDS.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
            How UT Autos works
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-gold/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <f.icon className="h-5 w-5 text-gold-bright" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/20 bg-gradient-to-b from-surface to-background-elevated px-8 py-16 text-center">
          <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
            Your garage is waiting.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Create an account, add your first vehicle, and book your first
            detail in minutes.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/signup">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
