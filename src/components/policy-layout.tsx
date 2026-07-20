import { Seo } from "@/components/seo";

/** A paragraph string, or a bullet list with an optional lead-in line. */
export type PolicyBlock = string | { lead?: string; list: string[] };

export interface PolicySection {
  title: string;
  blocks: PolicyBlock[];
}

interface PolicyLayoutProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  path: string;
  seoDescription?: string;
  sections: PolicySection[];
}

function Block({ block }: { block: PolicyBlock }) {
  if (typeof block === "string") {
    return (
      <p className="leading-relaxed text-muted-foreground [&:not(:first-child)]:mt-3">
        {block}
      </p>
    );
  }
  return (
    <div className="[&:not(:first-child)]:mt-3">
      {block.lead && (
        <p className="leading-relaxed text-muted-foreground">{block.lead}</p>
      )}
      <ul className="mt-2 space-y-1.5">
        {block.list.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-muted-foreground"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Shared, on-brand layout for legal / policy / info pages. */
export function PolicyLayout({
  eyebrow = "Bedding World",
  title,
  intro,
  path,
  seoDescription,
  sections,
}: PolicyLayoutProps) {
  return (
    <>
      <Seo
        title={title}
        description={seoDescription ?? intro ?? title}
        path={path}
      />

      <div className="container max-w-4xl py-12 md:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
            {intro}
          </p>
        )}

        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <h2 className="font-display text-2xl">{section.title}</h2>
              <div className="mt-3">
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
