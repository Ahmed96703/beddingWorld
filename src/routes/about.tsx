import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const whatsappUrl = "https://wa.me/923054788662";

  return (
    <>
      <Seo
        title="About Us"
        description="Learn more about Bedding World, our story, and how to contact us."
        path="/about-us"
      />

      <div className="container max-w-4xl py-12 md:py-16">
        <p className="eyebrow">About us</p>
        <h1 className="mt-3 text-balance font-display text-4xl leading-tight md:text-5xl">
          Bedding World is built around comfort, craft, and easy everyday
          shopping.
        </h1>
        <p className="mt-5 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
          We focus on bedding and home textiles that feel good to live with:
          soft sheets, seasonal layers, practical protectors, and celebration
          pieces for weddings and gifts. Everything is designed to make the
          store simple to browse and easy to buy on cash on delivery.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Contact</h2>
            <div className="mt-5 space-y-3 text-sm">
              <p className="font-medium text-foreground">Mohsin Khan</p>
              <a
                href="tel:+923054788662"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-clay" />
                +92 305 4788662
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4 text-clay" />
                Chat on WhatsApp
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">What we do</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>Premium bedding for everyday use and special occasions.</li>
              <li>Fast, clear catalog browsing with helpful category nesting.</li>
              <li>Cash on delivery so customers can order with confidence.</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/">
              Continue shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
