import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type MyQuestionItem = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  categoryTitle: string | null;
  moderationNote: string | null;
};

export type MyQuestionStats = {
  pendingReview: number;
  published: number;
  rejected: number;
  revisionRequested: number;
  total: number;
};

type QuestionRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  moderation_note: string | null;
  categories: { title: string } | { title: string }[] | null;
};

function readCategoryTitle(
  categories: QuestionRow["categories"],
): string | null {
  if (!categories) {
    return null;
  }

  if (Array.isArray(categories)) {
    return categories[0]?.title ?? null;
  }

  return categories.title ?? null;
}

export function computeMyQuestionStats(
  questions: MyQuestionItem[],
): MyQuestionStats {
  const stats: MyQuestionStats = {
    pendingReview: 0,
    published: 0,
    rejected: 0,
    revisionRequested: 0,
    total: questions.length,
  };

  for (const question of questions) {
    switch (question.status) {
      case "pending_review":
        stats.pendingReview += 1;
        break;
      case "published":
      case "closed":
        stats.published += 1;
        break;
      case "rejected":
        stats.rejected += 1;
        break;
      case "revision_requested":
        stats.revisionRequested += 1;
        break;
      default:
        break;
    }
  }

  return stats;
}

export async function getMyQuestions(authorId: string): Promise<MyQuestionItem[]> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      title,
      status,
      created_at,
      moderation_note,
      categories ( title )
    `,
    )
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getMyQuestions]", error.message);
    return [];
  }

  return (data as QuestionRow[] | null)?.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
    categoryTitle: readCategoryTitle(row.categories),
    moderationNote: row.moderation_note,
  })) ?? [];
}
