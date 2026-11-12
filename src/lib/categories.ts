export type CategoryRow = { id: string; name: string; data: Record<string, unknown> };
export const parentOf = (c: CategoryRow) => String(c.data['parent'] ?? '').trim();
export const mainCategories = (rows: CategoryRow[]) => rows.filter(c => !parentOf(c));
export const subCategories = (rows: CategoryRow[], parent: string) => rows.filter(c => parentOf(c) === parent);
/** A story matches a category when filed under it or under one of its subcategories. */
export function matchesCategory(rows: CategoryRow[], storyCategory: string, selected: string) {
  return storyCategory === selected || subCategories(rows, selected).some(s => s.name === storyCategory);
}
