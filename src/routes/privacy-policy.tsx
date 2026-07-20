import { PolicyLayout, type PolicySection } from "@/components/policy-layout";

const sections: PolicySection[] = [
  {
    title: "Personal Identification Information",
    blocks: [
      {
        lead: "We may collect personal information from customers in various ways, including when you:",
        list: [
          "Register an account",
          "Place an order",
          "Subscribe to our newsletter",
          "Contact our customer support",
          "Fill out a contact form",
        ],
      },
      {
        lead: "The information we may collect includes:",
        list: [
          "Full Name",
          "Email Address",
          "Mobile Number",
          "Shipping & Billing Address",
          "Payment Details (where applicable)",
        ],
      },
      "Providing this information is voluntary, but certain services may not be available without it.",
    ],
  },
  {
    title: "Cookies",
    blocks: [
      "Our website may use cookies to improve your browsing experience. Cookies help us remember your preferences, analyze website traffic, and enhance website performance.",
      "You can choose to disable cookies through your browser settings. However, some features of the website may not function properly if cookies are disabled.",
    ],
  },
  {
    title: "How Your Information Is Useful to Us",
    blocks: [
      {
        lead: "We use the information you provide to:",
        list: [
          "Process and deliver your orders.",
          "Improve customer service and respond to your inquiries.",
          "Personalize your shopping experience.",
          "Improve our website and product offerings.",
          "Send order confirmations and delivery updates.",
          "Notify you about promotions, discounts, and new arrivals (only if you have subscribed).",
          "Prevent fraudulent transactions and maintain website security.",
        ],
      },
      "We never sell or rent your personal information to third parties.",
    ],
  },
  {
    title: "How We Protect Your Information",
    blocks: [
      "We maintain appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
      "Your personal information, including your name, address, email, phone number, login credentials, and transaction details, is stored on secure servers with industry-standard security practices.",
    ],
  },
  {
    title: "Sharing Your Information",
    blocks: [
      {
        lead: "We may share your information only when necessary with trusted third parties such as:",
        list: [
          "Courier and delivery partners",
          "Payment service providers",
          "Website hosting providers",
          "Government authorities where required by law",
        ],
      },
      "These parties are required to keep your information confidential and use it only for the purpose of providing their services.",
    ],
  },
  {
    title: "Payment Security",
    blocks: [
      "Your payment information is processed through secure payment gateways. Bedding World does not store complete debit or credit card information on its servers.",
    ],
  },
  {
    title: "Third-Party Websites",
    blocks: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy policies or content of those websites. We encourage users to review the privacy policies of any external websites they visit.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    blocks: [
      "Bedding World reserves the right to update this Privacy Policy at any time. Any changes will be posted on this page with the updated revision date.",
    ],
  },
  {
    title: "Contact Us",
    blocks: [
      "If you have any questions regarding this Privacy Policy, please contact us on WhatsApp at +92 305 4788662.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Privacy Policy"
      path="/privacy-policy"
      intro="At Bedding World, we respect your privacy and are committed to protecting the personal information you share with us. We collect customer information only to provide a better shopping experience and process your orders efficiently."
      sections={sections}
    />
  );
}
