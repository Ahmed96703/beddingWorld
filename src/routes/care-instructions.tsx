import { PolicyLayout, type PolicySection } from "@/components/policy-layout";

const sections: PolicySection[] = [
  {
    title: "Washing & Care",
    blocks: [
      {
        list: [
          "Turn inside out before washing",
          "Wash dark colors separately",
          "Gentle machine wash",
          "Warm iron on reverse only",
          "Do not dry clean",
          "Do not bleach",
          "Wash in cold water, not warm",
          "Rinse gently",
          "Hand wash dark colors (recommended)",
        ],
      },
    ],
  },
];

export default function CareInstructionsPage() {
  return (
    <PolicyLayout
      eyebrow="Care Instructions"
      title="Care Instructions"
      path="/care-instructions"
      intro="Tips to increase the product life — a little care keeps your bedding soft, bright, and lasting for years."
      sections={sections}
    />
  );
}
