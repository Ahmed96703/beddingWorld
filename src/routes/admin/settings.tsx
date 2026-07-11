import { useEffect, useState } from "react";
import { Loader2, Save, Store, Coins, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import { fetchSettings, updateSettings, type StoreSettings } from "@/lib/api";
import { CURRENCY_OPTIONS } from "@/lib/money";

export default function AdminSettings() {
  const { data, loading, error, refetch } = useAsync(fetchSettings, []);
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = <K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K],
  ) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success("Settings saved", {
        description: "Currency changes apply on the next page load.",
      });
      refetch();
    } catch (err) {
      toast.error("Could not save settings", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Store</p>
        <h1 className="mt-1 font-display text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Yahan se store ka naam, currency aur shipping control karein.
        </p>
      </header>

      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : loading || !form ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : (
        <form onSubmit={save} className="space-y-6">
          {/* Store identity */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <Store className="h-5 w-5 text-clay" />
              <h2 className="font-display text-lg">Store</h2>
            </div>
            <div className="max-w-sm">
              <Label className="mb-2 block">Store name</Label>
              <Input
                value={form.store_name}
                onChange={(e) => set("store_name", e.target.value)}
                placeholder="LINÉA"
              />
            </div>
          </section>

          {/* Currency */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <Coins className="h-5 w-5 text-clay" />
              <h2 className="font-display text-lg">Currency</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block">Base currency</Label>
                <Select
                  value={form.base_currency}
                  onValueChange={(v) => set("base_currency", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} — {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  Aap jis currency mein product prices likhte hain. (e.g. PKR ya
                  USD)
                </p>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Auto-detect currency</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Har visitor ko uske mulk ki currency mein price dikhayein
                    (live rates par convert).
                  </p>
                </div>
                <Switch
                  checked={form.auto_detect_currency}
                  onCheckedChange={(v) => set("auto_detect_currency", v)}
                />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <Truck className="h-5 w-5 text-clay" />
              <h2 className="font-display text-lg">Shipping</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block">
                  Flat shipping fee ({form.base_currency})
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.shipping_flat}
                  onChange={(e) =>
                    set("shipping_flat", Number(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label className="mb-2 block">
                  Free shipping over ({form.base_currency})
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.free_shipping_threshold}
                  onChange={(e) =>
                    set("free_shipping_threshold", Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
