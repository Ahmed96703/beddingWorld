import type { CategoryRow } from "@/integrations/supabase/types";

export interface CategoryNode extends CategoryRow {
  children: CategoryNode[];
}

/** Build a nested tree from the flat category list. */
export function buildCategoryTree(flat: CategoryRow[]): CategoryNode[] {
  const byId = new Map<string, CategoryNode>();
  flat.forEach((c) => byId.set(c.id, { ...c, children: [] }));

  const roots: CategoryNode[] = [];
  byId.forEach((node) => {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortRec = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

/** Collect a category id plus the ids of all of its descendants. */
export function collectDescendantIds(
  flat: CategoryRow[],
  rootId: string,
): string[] {
  const childrenOf = new Map<string, string[]>();
  flat.forEach((c) => {
    if (!c.parent_id) return;
    const list = childrenOf.get(c.parent_id) ?? [];
    list.push(c.id);
    childrenOf.set(c.parent_id, list);
  });

  const result: string[] = [];
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    result.push(id);
    const kids = childrenOf.get(id);
    if (kids) stack.push(...kids);
  }
  return result;
}

/** Find a node by slug anywhere in the tree. */
export function findBySlug(
  flat: CategoryRow[],
  slug: string,
): CategoryRow | undefined {
  return flat.find((c) => c.slug === slug);
}

/** Direct children of a given category. */
export function childrenOf(
  flat: CategoryRow[],
  parentId: string,
): CategoryRow[] {
  return flat
    .filter((c) => c.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

/** Walk from a category up to the root, returning the chain from parent to top. */
export function ancestorChain(
  flat: CategoryRow[],
  categoryId: string | null | undefined,
): CategoryRow[] {
  if (!categoryId) return [];
  const byId = new Map(flat.map((c) => [c.id, c]));
  const chain: CategoryRow[] = [];
  let current = byId.get(categoryId);
  while (current?.parent_id) {
    const parent = byId.get(current.parent_id);
    if (!parent) break;
    chain.push(parent);
    current = parent;
  }
  return chain;
}

/** Check whether a category lives under an ancestor with the provided slug. */
export function isDescendantOfSlug(
  flat: CategoryRow[],
  categoryId: string | null | undefined,
  ancestorSlug: string,
): boolean {
  return ancestorChain(flat, categoryId).some((c) => c.slug === ancestorSlug);
}
