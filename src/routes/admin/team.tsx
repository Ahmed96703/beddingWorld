import { useState } from "react";
import { UserPlus, Loader2, Trash2, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import { listAdmins, grantAdmin, revokeAdmin, type AdminMember } from "@/lib/api";
import { useAuth } from "@/context/auth";

export default function AdminTeam() {
  const { user } = useAuth();
  const admins = useAsync(listAdmins, []);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [pendingRevoke, setPendingRevoke] = useState<AdminMember | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    try {
      await grantAdmin(email.trim());
      toast.success("Admin added", { description: email.trim() });
      setEmail("");
      admins.refetch();
    } catch (err) {
      toast.error("Could not add admin", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setAdding(false);
    }
  };

  const revoke = async () => {
    if (!pendingRevoke) return;
    try {
      await revokeAdmin(pendingRevoke.user_id);
      toast.success("Admin removed", { description: pendingRevoke.email });
      admins.refetch();
    } catch (err) {
      toast.error("Could not remove admin", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPendingRevoke(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Access</p>
        <h1 className="mt-1 font-display text-3xl">Team & Admins</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Apne doston ko admin banayein taake woh bhi store manage kar saken.
        </p>
      </header>

      {/* How-to for non-technical friends */}
      <div className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-5 text-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
        <div className="space-y-1">
          <p className="font-medium">Naya admin kaise add karein (2 steps):</p>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>
              Aapka dost <code>/admin/login</code> par jaa kar apne email +
              password se <strong>Register</strong> kare.
            </li>
            <li>
              Phir aap niche uska wahi email daal kar{" "}
              <strong>“Make admin”</strong> dabayein — bas ho gaya.
            </li>
          </ol>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Admin list */}
        <section>
          {admins.error ? (
            <ErrorState error={admins.error} onRetry={admins.refetch} />
          ) : admins.loading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <ul className="divide-y divide-border">
                {(admins.data ?? []).map((a) => {
                  const isYou = a.email === user?.email;
                  return (
                    <li
                      key={a.user_id}
                      className="flex items-center gap-3 p-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay/15 text-clay">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {a.email}{" "}
                          {isYou && (
                            <span className="text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                      </div>
                      {!isYou && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPendingRevoke(a)}
                          aria-label={`Remove ${a.email}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* Add admin */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <form
            onSubmit={add}
            className="space-y-4 rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-lg">Add an admin</h2>
            <div>
              <Label className="mb-2 block">Their email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@email.com"
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Email wahi hona chahiye jisse unhone register kiya hai.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={adding}>
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Make admin
            </Button>
          </form>
        </aside>
      </div>

      {pendingRevoke && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg">Remove admin?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              “{pendingRevoke.email}” ka admin access hata diya jayega. Woh phir
              store manage nahi kar payenge.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPendingRevoke(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={revoke}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
