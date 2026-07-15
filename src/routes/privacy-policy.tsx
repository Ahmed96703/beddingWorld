import { Seo } from "@/components/seo";

const sections = [
  {
    title: "Information we collect",
    body:
      "We collect the details you share during checkout, account creation, newsletter sign-up, or customer support conversations. This may include your name, email, phone number, shipping address, and order notes.",
  },
  {
    title: "How we use it",
    body:
      "We use your information to process orders, provide delivery updates, respond to inquiries, improve the website, and send promotional messages only when you have opted in.",
  },
  {
    title: "Cookies and security",
    body:
      "Cookies help us remember preferences and understand site usage. We use reasonable technical safeguards to protect your data, and we do not sell or rent your personal information.",
  },
  {
    title: "Sharing",
    body:
      "We may share limited information with trusted service providers such as couriers, payment partners, website hosting vendors, or authorities where the law requires it.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Bedding World collects, uses, and protects customer information."
        path="/privacy-policy"
      />

      <div className="container max-w-4xl py-12 md:py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          We respect your privacy and keep this policy simple: collect what we
          need to fulfil orders, use it responsibly, and protect it carefully.
        </p>

        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
