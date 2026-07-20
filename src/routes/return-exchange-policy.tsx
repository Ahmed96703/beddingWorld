import { PolicyLayout, type PolicySection } from "@/components/policy-layout";

const sections: PolicySection[] = [
  {
    title: "Exchanges Due to Error or Damage",
    blocks: [
      {
        lead: "We will promptly exchange your product if:",
        list: [
          "You received the wrong item or size, or",
          "The product was damaged upon delivery.",
        ],
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    blocks: [
      {
        lead: "We want you to shop with confidence at Bedding World. If you change your mind about your purchase, you can request an exchange, provided the following conditions are met:",
        list: [
          "The request is made within 14 days of purchase.",
          "You have proof of purchase (e.g. the invoice sent with your order).",
          "The item is unused, unwashed, unworn, and in its original packaging.",
        ],
      },
    ],
  },
  {
    title: "How to Request a Return or Exchange",
    blocks: [
      "To initiate a return or exchange, contact us on WhatsApp at +92 305 4788662 with your order details and clear photos of the item. Our team will guide you through the process.",
    ],
  },
  {
    title: "Non-Returnable Items",
    blocks: [
      {
        lead: "Please note: for hygiene reasons, we do not accept returns or exchanges on the following items:",
        list: [
          "Quilts",
          "Pillows",
          "Toppers",
          "Mattress protectors",
          "Pillow protectors",
        ],
      },
      "Kindly choose these items carefully before placing your order.",
    ],
  },
];

export default function ReturnExchangePolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Return & Exchange Policy"
      path="/return-exchange-policy"
      intro="Your satisfaction matters to us. Here's how returns and exchanges work at Bedding World."
      sections={sections}
    />
  );
}
