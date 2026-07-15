import { Seo } from "@/components/seo";

const points = [
  "Please inspect your order when it arrives and contact us quickly if something is wrong.",
  "Defective, damaged, or incorrectly shipped items should be reported as soon as possible with photos.",
  "Returns or exchanges can only be considered for items that remain unused and in original condition.",
  "Custom or made-to-order pieces may have different handling requirements and may not be exchangeable.",
];

export default function ReturnExchangePolicyPage() {
  return (
    <>
      <Seo
        title="Return & Exchange Policy"
        description="Return and exchange guidance for Bedding World orders."
        path="/return-exchange-policy"
      />

      <div className="container max-w-4xl py-12 md:py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Return & Exchange Policy
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Bedding World aims to keep the process straightforward: if something
          arrives damaged or isn’t what you ordered, we’ll work with you to
          resolve it.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Key points</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Need help?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Contact us through WhatsApp or the details listed on the About Us
            page and include your order reference so we can help faster.
          </p>
        </div>
      </div>
    </>
  );
}
