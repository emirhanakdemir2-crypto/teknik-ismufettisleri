import "server-only";

import {
  createNotificationForUser,
  createNotificationsForRoles,
} from "@/lib/notifications/create";
import { NOTIFICATION_TYPES } from "@/lib/notifications/types";
import { createAdminClient } from "@/lib/supabase/admin";

export async function notifyQuestionPendingReview(input: {
  questionId: string;
  questionTitle: string;
  authorId: string;
}): Promise<void> {
  await createNotificationsForRoles(
    ["admin", "moderator"],
    NOTIFICATION_TYPES.QUESTION_PENDING_REVIEW,
    {
      title: "İnceleme bekleyen yeni soru var",
      body: `"${input.questionTitle}" başlıklı soru moderasyon kuyruğuna eklendi.`,
      href: "/admin/questions",
      questionId: input.questionId,
    },
    { excludeUserIds: [input.authorId] },
  );
}

export async function notifyQuestionPublished(input: {
  questionId: string;
  questionTitle: string;
}): Promise<void> {
  await createNotificationsForRoles(["verified_inspector"], NOTIFICATION_TYPES.QUESTION_PUBLISHED, {
    title: "Cevap bekleyen yeni bir soru yayımlandı",
    body: `"${input.questionTitle}" başlıklı soru yayımlandı.`,
    href: `/questions/${input.questionId}`,
    questionId: input.questionId,
  });
}

export async function notifyQuestionAnswerPublished(input: {
  questionId: string;
  questionTitle: string;
  answerId: string;
  authorId: string | null;
}): Promise<void> {
  if (!input.authorId) {
    return;
  }

  await createNotificationForUser(input.authorId, NOTIFICATION_TYPES.QUESTION_ANSWER_PUBLISHED, {
    title: "Sorunuza yeni bir müfettiş cevabı eklendi",
    body: `"${input.questionTitle}" başlıklı sorunuza yeni bir müfettiş cevabı yayımlandı.`,
    href: `/questions/${input.questionId}`,
    questionId: input.questionId,
    answerId: input.answerId,
  });
}

export async function notifyInspectorApplicationPending(input: {
  applicationId: string;
}): Promise<void> {
  await createNotificationsForRoles(
    ["admin"],
    NOTIFICATION_TYPES.INSPECTOR_APPLICATION_PENDING,
    {
      title: "Yeni müfettiş başvurusu var",
      body: "İnceleme bekleyen yeni bir müfettiş başvurusu alındı.",
      href: "/admin/inspector-applications",
      applicationId: input.applicationId,
    },
  );
}

export async function notifyQuestionAnswerPublishedForQuestion(
  questionId: string,
  answerId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("questions")
    .select("title, author_id")
    .eq("id", questionId)
    .maybeSingle();

  if (!data) {
    return;
  }

  await notifyQuestionAnswerPublished({
    questionId,
    questionTitle: data.title,
    answerId,
    authorId: data.author_id,
  });
}

export async function notifyQuestionPublishedWithTitle(
  questionId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("questions")
    .select("title")
    .eq("id", questionId)
    .maybeSingle();

  if (!data) {
    return;
  }

  await notifyQuestionPublished({
    questionId,
    questionTitle: data.title,
  });
}
