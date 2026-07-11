import { useEffect, useState } from "react";
import { Loader2, Upload, X, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImage } from "@/components/product-image";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";
import type { CategoryRow, ProductRow } from "@/integrations/supabase/types";
import { slugify } from "@/lib/utils";
import { useCurrency } from "@/context/currency";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  product: ProductRow | null;
  categories: CategoryRow[];
}

interface Draft {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAt: string;
  categoryId: string;
  stock: string;
  status: "live" | "draft";
  featured: boolean;
  images: string[];
}

const EMPTY: Draft = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAt: "",
  categoryId: "",
  stock: "0",
  status: "draft",
  featured: false,
  images: [],
};

export function ProductForm({
  open,
  onClose,
  onSaved,
  product,
  categories,
}: ProductFormProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const { baseCode } = useCurrency();
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setDraft({
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        price: String(product.price),
        compareAt: product.compare_at_price?.toString() ?? "",
        categoryId: product.category_id ?? "",
        stock: String(product.stock),
        status: product.status,
        featured: product.featured,
        images: product.images ?? [],
      });
      setSlugTouched(true);
    } else {
      setDraft(EMPTY);
      setSlugTouched(false);
    }
  }, [product, open]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleName = (name: string) => {
    setDraft((d) => ({
      ...d,
      name,
      slug: slugTouched ? d.slug : slugify(name),
    }));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadProductImage(file));
      }
      setDraft((d) => ({ ...d, images: [...d.images, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) =>
    setDraft((d) => ({ ...d, images: d.images.filter((i) => i !== url) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(draft.price);
    if (!draft.name.trim() || !draft.slug.trim() || !Number.isFinite(price)) {
      toast.error("Name, slug, and a valid price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: draft.name.trim(),
      slug: slugify(draft.slug),
      description: draft.description.trim() || null,
      price,
      compare_at_price: draft.compareAt ? Number(draft.compareAt) : null,
      category_id: draft.categoryId || null,
      stock: Number(draft.stock) || 0,
      status: draft.status,
      featured: draft.featured,
      images: draft.images,
    };
    try {
      if (product) {
        await updateProduct(product.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error("Could not save product", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  // Only leaf-ish categories make sense, but allow any for flexibility.
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92dvh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the details and save your changes."
              : "Fill in the details to add a product to your catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => handleName(e.target.value)}
                placeholder="Stonewashed Linen Duvet"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Slug</Label>
              <Input
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                placeholder="stonewashed-linen-duvet"
                required
              />
            </div>

            <div>
              <Label className="mb-2 block">Price ({baseCode})</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="129.00"
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">Compare-at price (optional)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.compareAt}
                onChange={(e) => set("compareAt", e.target.value)}
                placeholder="159.00"
              />
            </div>

            <div>
              <Label className="mb-2 block">Category</Label>
              <Select
                value={draft.categoryId || "none"}
                onValueChange={(v) => set("categoryId", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Stock</Label>
              <Input
                type="number"
                min="0"
                value={draft.stock}
                onChange={(e) => set("stock", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="mb-2 block">Description</Label>
              <Textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Woven from 100% European flax…"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label className="mb-2 block">Images</Label>
            <div className="flex flex-wrap gap-3">
              {draft.images.map((url, i) => (
                <div
                  key={url}
                  className="group relative h-24 w-20 overflow-hidden rounded-md border border-border bg-secondary"
                >
                  <ProductImage src={url} alt={`Image ${i + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-clay px-1.5 py-0.5 text-[0.55rem] font-medium uppercase text-clay-foreground">
                      Main
                    </span>
                  )}
                </div>
              ))}

              <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                <span className="text-[0.65rem]">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Uploaded to the <code>product-images</code> bucket. The first
              image is used as the main thumbnail.
            </p>
          </div>

          {/* Toggles */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">
                  {draft.status === "live"
                    ? "Visible in the store"
                    : "Hidden from the store"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={
                    draft.status === "draft" ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  Draft
                </span>
                <Switch
                  checked={draft.status === "live"}
                  onCheckedChange={(v) => set("status", v ? "live" : "draft")}
                />
                <span
                  className={
                    draft.status === "live" ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  Live
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-2">
                <Star
                  className={
                    "h-4 w-4 " +
                    (draft.featured ? "fill-clay text-clay" : "text-muted-foreground")
                  }
                />
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">
                    Show on the homepage
                  </p>
                </div>
              </div>
              <Switch
                checked={draft.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? "Save changes" : "Create product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
