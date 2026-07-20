import { PolicyLayout, type PolicySection } from "@/components/policy-layout";

const sections: PolicySection[] = [
  {
    title: "Processing Time",
    blocks: ["Delivery usually takes 2–5 business days."],
  },
  {
    title: "Shipping Methods & Delivery Time",
    blocks: [
      {
        lead: "We offer multiple shipping options based on your location:",
        list: [
          "Standard Shipping: Estimated delivery in 2–5 business days (depending upon city).",
          "Express Shipping: Estimated delivery in 1–2 business days (extra charges apply).",
        ],
      },
    ],
  },
  {
    title: "Tracking Your Order",
    blocks: [
      "A tracking number will be shared with you after your order has been shipped. You can track your order through our courier's website.",
    ],
  },
  {
    title: "Lost or Delayed Shipments",
    blocks: [
      "If your order is delayed please contact us. We will try our best to resolve the issue. However, we are not responsible for delays due to weather conditions or unforeseen courier issues.",
    ],
  },
  {
    title: "Damaged or Incorrect Items",
    blocks: [
      "If you receive a damaged or incorrect item, please notify us within 48 hours of delivery. We may request photos as proof and will arrange for a replacement or refund.",
    ],
  },
  {
    title: "Contact Us",
    blocks: [
      "If you have any questions regarding our shipping policy, please contact us on WhatsApp at +92 305 4788662.",
    ],
  },
];

export default function ShoppingPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Shipping Policy"
      path="/shopping-policy"
      intro="Everything you need to know about how and when your Bedding World order reaches you."
      sections={sections}
    />
  );
}
