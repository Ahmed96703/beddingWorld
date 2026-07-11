import { AlertTriangle, PackageOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-clay" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  message,
  icon: Icon = PackageOpen,
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground/70" />
      <h3 className="font-display text-lg">{title}</h3>
      {message && (
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  const configIssue = !isSupabaseConfigured;
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div className="space-y-1">
        <h3 className="font-display text-lg">
          {configIssue ? "Connect your Supabase project" : "Something went wrong"}
        </h3>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {configIssue
            ? "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server. See README for the full setup."
            : error.message}
        </p>
      </div>
      {onRetry && !configIssue && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
