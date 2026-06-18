import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { PUBLIC_QUESTION_STATUSES } from "@/lib/questions/public-status";
import type { ActiveCategory } from "@/lib/questions/queries";
import { getActiveCategories } from "@/lib/questions/queries";

export type CategoryIndexItem = ActiveCategory & {
  publishedCount: number;
  lastPublishedAt: string | null;
};

async function getPublicQuestionCountsByCategory(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("category_id")
    .in("status", [...PUBLIC_QUESTION_STATUSES]);

  if (error || !data) {
    return counts;
  }

  for (const row of data) {
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return counts;
}

async function getLastPublishedAtByCategory(): Promise<Map<string, string>> {
  const lastDates = new Map<string, string>();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("category_id, published_at")
    .in("status", [...PUBLIC_QUESTION_STATUSES])
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error || !data) {
    return lastDates;
  }

  for (const row of data) {
    if (!row.published_at || lastDates.has(row.category_id)) {
      continue;
    }
    lastDates.set(row.category_id, row.published_at);
  }

  return lastDates;
}

export async function getCategoryIndexItems(): Promise<CategoryIndexItem[]> {
  noStore();
  const [categories, counts, lastDates] = await Promise.all([
    getActiveCategories(),
    getPublicQuestionCountsByCategory(),
    getLastPublishedAtByCategory(),
  ]);

  return categories.map((category) => ({
    ...category,
    publishedCount: counts.get(category.id) ?? 0,
    lastPublishedAt: lastDates.get(category.id) ?? null,
  }));
}

export async function getActiveCategoryBySlug(
  slug: string,
): Promise<ActiveCategory | null> {
  noStore();
  const normalized = slug.trim();

  if (!normalized) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, title, slug, description")
    .eq("slug", normalized)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getActiveCategoryBySlug]", error.message);
    return null;
  }

  return data;
}

export async function getPublicQuestionCountForCategory(
  categoryId: string,
): Promise<number> {
  noStore();
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId)
    .in("status", [...PUBLIC_QUESTION_STATUSES]);

  if (error) {
    console.error("[getPublicQuestionCountForCategory]", error.message);
    return 0;
  }

  return count ?? 0;
}
