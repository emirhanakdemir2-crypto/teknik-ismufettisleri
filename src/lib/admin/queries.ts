import { createClient } from "@/lib/supabase/server";

export type ModerationDashboardStats = {
  pendingCount: number;
  publishedCount: number;
  rejectedCount: number;
};

export type PendingQuestionItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  categoryTitle: string | null;
  authorDisplayName: string | null;
};

function truncateBody(body: string, maxLength = 160): string {
  const trimmed = body.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export async function getModerationDashboardStats(): Promise<ModerationDashboardStats> {
  const supabase = await createClient();

  const [pending, published, rejected] = await Promise.all([
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review"),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .in("status", ["published", "closed"]),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),
  ]);

  return {
    pendingCount: pending.count ?? 0,
    publishedCount: published.count ?? 0,
    rejectedCount: rejected.count ?? 0,
  };
}

export async function getPendingReviewQuestions(): Promise<PendingQuestionItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      title,
      body,
      created_at,
      categories ( title ),
      profiles!questions_author_id_fkey ( display_name )
    `,
    )
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const category = row.categories as { title: string } | null;
    const profile = row.profiles as { display_name: string | null } | null;

    return {
      id: row.id,
      title: row.title,
      body: truncateBody(row.body),
      createdAt: row.created_at,
      categoryTitle: category?.title ?? null,
      authorDisplayName: profile?.display_name ?? null,
    };
  });
}

export async function getQuestionForModeration(questionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("id, status")
    .eq("id", questionId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
