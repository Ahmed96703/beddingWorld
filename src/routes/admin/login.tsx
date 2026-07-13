import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, Crown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import { adminExists, claimAdminRole } from "@/lib/api";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

type Mode = "signin" | "signup";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, signUp, refreshRole } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  // Redirect admins straight to the dashboard.
  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  // Discover whether an admin already exists (controls the claim flow).
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    adminExists()
      .then(setHasAdmin)
      .catch(() => setHasAdmin(null));
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        await refreshRole();
        toast.success("Signed in");
      } else {
        await signUp(email, password);
        toast.success("Account created", {
          description: "If email confirmation is on, verify before signing in.",
        });
        await refreshRole();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  const claim = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await claimAdminRole(user.id);
      await refreshRole();
      toast.success("Admin access granted");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim admin.");
    } finally {
      setBusy(false);
    }
  };

  // Signed in, not admin: either offer the claim flow or show "denied".
  const signedInNotAdmin = user && !isAdmin;
  const canClaim = signedInNotAdmin && hasAdmin === false;

  return (
    <div className="grid min-h-dvh place-items-center bg-secondary/30 px-5 py-12">
      <Seo title="Admin Login" description="Sign in to the Bedding World admin console." noindex />

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center font-display text-3xl tracking-tight"
        >
          Bedding World<span className="text-clay">.</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl">Admin Console</h1>
              <p className="text-sm text-muted-foreground">
                Authorized access only
              </p>
            </div>
          </div>

          {!isSupabaseConfigured ? (
            <div className="space-y-4">
              <div className="flex gap-2 rounded-lg border border-clay/40 bg-clay/5 p-4 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                <span>
                  <strong>Demo mode.</strong> No Supabase connected — explore the
                  full dashboard with sample data. Changes are saved in this
                  browser only. Connect Supabase for real, persistent data.
                </span>
              </div>
              <Button
                className="w-full"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await signIn("demo@linea.local", "demo-preview");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Enter demo dashboard →
              </Button>
            </div>
          ) : canClaim ? (
            <div className="space-y-4 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-clay/15 text-clay">
                <Crown className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-lg">Claim admin access</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  No admin exists yet. As the first registered user, you can
                  claim the admin role for{" "}
                  <strong className="text-foreground">{user?.email}</strong>.
                </p>
              </div>
              <Button onClick={claim} className="w-full" disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Claim admin role
              </Button>
            </div>
          ) : signedInNotAdmin ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                You're signed in as{" "}
                <strong className="text-foreground">{user?.email}</strong>, but
                this account isn't an admin.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Back to store
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
                {(["signin", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                    className={
                      "rounded-md py-2 text-sm font-medium transition-colors " +
                      (mode === m
                        ? "bg-card shadow-sm"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {m === "signin" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label className="mb-2 block" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@linea.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label className="mb-2 block" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={
                      mode === "signin" ? "current-password" : "new-password"
                    }
                  />
                </div>

                {error && (
                  <p className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={busy || !isSupabaseConfigured}
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {mode === "signup" && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  The first registered user can claim admin access after signing
                  in.
                </p>
              )}
            </>
          )}
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
