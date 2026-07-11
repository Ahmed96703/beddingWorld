import { useMemo, useState } from "react";
import { Plus, Trash2, Loader2, CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "@/lib/api";
import { buildCategoryTree, type CategoryNode } from "@/lib/categories";
import type { CategoryRow } from "@/integrations/supabase/types";
import { slugify } from "@/lib/utils";

export default function AdminCategories() {
  const categories = useAsync(fetchCategories, []);
  const tree = useMemo(
    () => buildCategoryTree(categories.data ?? []),
    [categories.data],
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [parentId, setParentId] = useState("none");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CategoryRow | null>(null);

  const onName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      await createCategory({
        name: name.trim(),
        slug: slugify(slug),
        parent_id: parentId === "none" ? null : parentId,
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        sort_order: Number(sortOrder) || 0,
      });
      toast.success("Category created");
      setName("");
      setSlug("");
      setSlugTouched(false);
      setParentId("none");
      setDescription("");
      setImageUrl("");
      setSortOrder("0");
      categories.refetch();
    } catch (err) {
      toast.error("Could not create category", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCategory(pendingDelete.id);
      toast.success("Category deleted");
      categories.refetch();
    } catch (err) {
      toast.error("Delete failed", {
        description:
          err instanceof Error
            ? err.message
            : "It may still have sub-categories or products.",
      });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Structure</p>
        <h1 className="mt-1 font-display text-3xl">Categories</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Tree */}
        <section>
          {categories.error ? (
            <ErrorState error={categories.error} onRetry={categories.refetch} />
          ) : categories.loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : tree.length === 0 ? (
            <EmptyState
              title="No categories yet"
              message="Create your first top-level category using the form."
            />
          ) : (
            <div className="rounded-xl border border-border bg-card">
              <ul className="divide-y divide-border">
                {tree.map((node) => (
                  <CategoryBranch
                    key={node.id}
                    node={node}
                    depth={0}
                    onDelete={setPendingDelete}
                  />
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Create form */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <form
            onSubmit={submit}
            className="space-y-4 rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-lg">Add category</h2>

            <div>
              <Label className="mb-2 block">Name</Label>
              <Input
                value={name}
                onChange={(e) => onName(e.target.value)}
                placeholder="Bed Sheets"
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">Slug</Label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="bed-sheets"
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">Parent</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top level)</SelectItem>
                  {(categories.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Image URL (optional)</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <Label className="mb-2 block">Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short collection description…"
                className="min-h-[72px]"
              />
            </div>
            <div>
              <Label className="mb-2 block">Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add category
            </Button>
          </form>
        </aside>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg">Delete category?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              “{pendingDelete.name}” will be removed. Sub-categories must be
              deleted first.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryBranch({
  node,
  depth,
  onDelete,
}: {
  node: CategoryNode;
  depth: number;
  onDelete: (c: CategoryRow) => void;
}) {
  return (
    <>
      <li
        className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-secondary/40"
        style={{ paddingLeft: `${1.25 + depth * 1.25}rem` }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {depth > 0 && (
            <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span
            className={
              depth === 0 ? "font-medium" : "text-sm text-muted-foreground"
            }
          >
            {node.name}
          </span>
          <span className="truncate text-xs text-muted-foreground/70">
            /{node.slug}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(node)}
          aria-label={`Delete ${node.name}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </li>
      {node.children.map((child) => (
        <CategoryBranch
          key={child.id}
          node={child}
          depth={depth + 1}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
