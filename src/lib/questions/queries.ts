import { createClient } from "@/lib/supabase/server";
import { PUBLIC_QUESTION_STATUSES } from "@/lib/questions/public-status";

export type ActiveCategory = {
  id: string;
  title: string;
  slug: string;
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
};

export async function getActiveCategories(): Promise<ActiveCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, title, slug")
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

export async function getPublishedQuestions(
  limit?: number,
): Promise<PublishedQuestionListItem[]> {
  const supabase = await createClient();

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

  if (limit) {
    query = query.limit(limit);
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
    .select("id, body, published_at, edited_at")
    .eq("question_id", questionId)
    .eq("status", "published")
    .order("published_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    body: row.body,
    publishedAt: row.published_at,
    editedAt: row.edited_at,
  }));
}
