import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Newsletter signup — captures email locally with a polished success state. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="border-b border-border bg-secondary/50">
      <div className="container grid items-center gap-8 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">The Bedding World Letter</p>
          <h2 className="mt-3 max-w-md text-balance font-display text-3xl leading-tight md:text-4xl">
            Quiet luxury, delivered to your inbox.
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            New collections, slow-living rituals, and members-only offers. No
            noise — only the good stuff.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setDone(true);
          }}
          className="w-full"
        >
          {done ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay text-clay-foreground">
                <Check className="h-5 w-5" />
              </span>
              <p className="text-sm">
                You're on the list. Welcome to Bedding World.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="h-12 bg-card"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
