import { Link } from "react-router-dom";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you're looking for doesn't exist." noindex />
      <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <p className="font-display text-7xl text-clay md:text-8xl">404</p>
          <h1 className="mt-4 font-display text-3xl">This page has slipped away</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            The page you're looking for may have moved or no longer exists.
            Let's get you back to something comfortable.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/">Return home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
