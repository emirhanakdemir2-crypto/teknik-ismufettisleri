import { createClient } from "@/lib/supabase/server";

export type InspectorDashboardStats = {
  publishedQuestionCount: number;
  unansweredQuestionCount: number;
  ownAnswerCount: number;
};

export type InspectorQuestionListItem = {
  id: string;
  title: string;
  publishedAt: string | null;
  createdAt: string;
  categoryTitle: string | null;
  answerCount: number;
};

export type InspectorQuestionDetail = {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  createdAt: string;
  categoryTitle: string | null;
  answerCount: number;
};

async function getAnswerCountsByQuestion(
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

export async function getInspectorDashboardStats(
  inspectorId: string,
): Promise<InspectorDashboardStats> {
  const supabase = await createClient();

  const [publishedQuestions, ownAnswers] = await Promise.all([
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("answers")
      .select("id", { count: "exact", head: true })
      .eq("author_id", inspectorId)
      .eq("status", "published"),
  ]);

  const { data: publishedQuestionRows } = await supabase
    .from("questions")
    .select("id")
    .eq("status", "published");

  const questionIds = (publishedQuestionRows ?? []).map((row) => row.id);
  const answerCounts = await getAnswerCountsByQuestion(questionIds);

  let unansweredQuestionCount = 0;
  for (const questionId of questionIds) {
    if ((answerCounts.get(questionId) ?? 0) === 0) {
      unansweredQuestionCount += 1;
    }
  }

  return {
    publishedQuestionCount: publishedQuestions.count ?? 0,
    unansweredQuestionCount,
    ownAnswerCount: ownAnswers.count ?? 0,
  };
}

export async function getPublishedQuestionsForInspector(): Promise<
  InspectorQuestionListItem[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      title,
      published_at,
      created_at,
      categories ( title )
    `,
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const questionIds = data.map((row) => row.id);
  const answerCounts = await getAnswerCountsByQuestion(questionIds);

  const items = data.map((row) => {
    const category = row.categories as { title: string } | null;

    return {
      id: row.id,
      title: row.title,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      categoryTitle: category?.title ?? null,
      answerCount: answerCounts.get(row.id) ?? 0,
    };
  });

  return items.sort((a, b) => {
    if (a.answerCount === 0 && b.answerCount > 0) {
      return -1;
    }

    if (a.answerCount > 0 && b.answerCount === 0) {
      return 1;
    }

    const aDate = a.publishedAt ?? a.createdAt;
    const bDate = b.publishedAt ?? b.createdAt;
    return bDate.localeCompare(aDate);
  });
}

export async function getPublishedQuestionForInspector(
  questionId: string,
): Promise<InspectorQuestionDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      title,
      body,
      published_at,
      created_at,
      categories ( title )
    `,
    )
    .eq("id", questionId)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const answerCounts = await getAnswerCountsByQuestion([data.id]);
  const category = data.categories as { title: string } | null;

  return {
    id: data.id,
    title: data.title,
    body: data.body,
    publishedAt: data.published_at,
    createdAt: data.created_at,
    categoryTitle: category?.title ?? null,
    answerCount: answerCounts.get(data.id) ?? 0,
  };
}
