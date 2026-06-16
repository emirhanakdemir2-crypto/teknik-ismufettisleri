import { createClient } from "@/lib/supabase/server";
import { PUBLIC_QUESTION_STATUSES } from "@/lib/questions/public-status";
import {
  escapeIlikePattern,
  isSearchQueryValid,
  normalizeSearchQuery,
} from "@/lib/questions/search";

export type ActiveCategory = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
};

export type PublishedQuestionListItem = {
  id: string;
  title: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  categoryTitle: string | null;
  answerCount: number;
};

export type PublishedQuestionDetail = {
  id: string;
  title: string;
  body: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  categoryTitle: string | null;
};

export type PublishedAnswerItem = {
  id: string;
  body: string;
  publishedAt: string;
  editedAt: string | null;
  authorDisplayName: string | null;
  authorRole: string | null;
};

export async function getActiveCategories(): Promise<ActiveCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, title, slug, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return [];
  }

  return data ?? [];
}

async function getPublishedAnswerCounts(
  questionIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  if (questionIds.length === 0) {
    return counts;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("answers")
    .select("question_id")
    .eq("status", "published")
    .in("question_id", questionIds);

  if (error || !data) {
    return counts;
  }

  for (const row of data) {
    counts.set(row.question_id, (counts.get(row.question_id) ?? 0) + 1);
  }

  return counts;
}

export type GetPublishedQuestionsOptions = {
  limit?: number;
  search?: string;
  categorySlug?: string;
};

export async function getPublishedQuestions(
  options?: GetPublishedQuestionsOptions | number,
): Promise<PublishedQuestionListItem[]> {
  const opts: GetPublishedQuestionsOptions =
    typeof options === "number" ? { limit: options } : (options ?? {});

  const supabase = await createClient();
  const search = normalizeSearchQuery(opts.search);
  const categorySlug = opts.categorySlug?.trim() ?? "";

  let categoryId: string | null = null;

  if (categorySlug) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .maybeSingle();

    if (categoryError || !category) {
      return [];
    }

    categoryId = category.id;
  }

  let query = supabase
    .from("questions")
    .select(
      `
      id,
      title,
      status,
      published_at,
      created_at,
      categories ( title )
    `,
    )
    .in("status", [...PUBLIC_QUESTION_STATUSES])
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (isSearchQueryValid(search)) {
    const pattern = `%${escapeIlikePattern(search)}%`;
    query = query.or(`title.ilike.${pattern},body.ilike.${pattern}`);
  }

  if (opts.limit) {
    query = query.limit(opts.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  const questionIds = data.map((row) => row.id);
  const answerCounts = await getPublishedAnswerCounts(questionIds);

  return data.map((row) => {
    const category = row.categories as { title: string } | null;

    return {
      id: row.id,
      title: row.title,
      status: row.status,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      categoryTitle: category?.title ?? null,
      answerCount: answerCounts.get(row.id) ?? 0,
    };
  });
}

export async function getPublishedQuestionById(
  id: string,
): Promise<PublishedQuestionDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      title,
      body,
      status,
      published_at,
      created_at,
      categories ( title )
    `,
    )
    .eq("id", id)
    .in("status", [...PUBLIC_QUESTION_STATUSES])
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const category = data.categories as { title: string } | null;

  return {
    id: data.id,
    title: data.title,
    body: data.body,
    status: data.status,
    publishedAt: data.published_at,
    createdAt: data.created_at,
    categoryTitle: category?.title ?? null,
  };
}

export async function getPublishedAnswersForQuestion(
  questionId: string,
): Promise<PublishedAnswerItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("answers")
    .select(
      `
      id,
      body,
      published_at,
      edited_at,
      profiles!answers_author_id_fkey ( display_name, role )
    `,
    )
    .eq("question_id", questionId)
    .eq("status", "published")
    .order("published_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const profile = row.profiles as {
      display_name: string | null;
      role: string | null;
    } | null;

    return {
      id: row.id,
      body: row.body,
      publishedAt: row.published_at,
      editedAt: row.edited_at,
      authorDisplayName: profile?.display_name ?? null,
      authorRole: profile?.role ?? null,
    };
  });
}
