import { Seo } from "@/components/seo";

const careSteps = [
  "Wash similar colors together in cold or lukewarm water.",
  "Use a mild detergent and avoid bleach or harsh fabric softeners.",
  "Dry on a low setting or line dry when possible.",
  "For embroidered or delicate pieces, turn them inside out before washing.",
  "Iron on a low setting only if the fabric requires it.",
];

export default function CareInstructionsPage() {
  return (
    <>
      <Seo
        title="Care Instructions"
        description="How to wash and care for Bedding World textiles."
        path="/care-instructions"
      />

      <div className="container max-w-4xl py-12 md:py-16">
        <p className="eyebrow">Product care</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Care Instructions
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Good care keeps bedding softer for longer. Follow the fabric label
          first, then use these general guidelines for everyday care.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">General care</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {careSteps.map((step) => (
              <li key={step} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Extra tip</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Allow quilts, razai, and protectors to breathe fully after unpacking
            so they regain their shape and loft.
          </p>
        </div>
      </div>
    </>
  );
}
