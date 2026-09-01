import type { LegalDoc } from "@/lib/config/legal";

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <article>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        {doc.heading}
      </h1>
      <p className="mt-2 mb-8 text-xs uppercase tracking-widest text-muted">
        Last updated: {doc.lastUpdated}
      </p>
      {doc.intro?.map((p, i) => (
        <p key={i} className="mb-6 text-sm leading-relaxed text-muted">
          {p}
        </p>
      ))}
      <div className="space-y-6">
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-lg font-medium text-foreground">{section.title}</h2>
            {section.body.map((p, i) => (
              <p key={i} className="mt-1.5 text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
