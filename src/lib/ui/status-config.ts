export type BadgeTone = "neutral" | "green" | "amber" | "blue" | "red";

export type QuestionStatusKey =
  | "draft"
  | "pending_review"
  | "revision_requested"
  | "rejected"
  | "published"
  | "closed";

export type AnswerStatusKey = "published" | "hidden" | "deleted";

type StatusConfig = {
  label: string;
  tone: BadgeTone;
};

export const QUESTION_STATUS_CONFIG: Record<QuestionStatusKey, StatusConfig> = {
  draft: { label: "Taslak", tone: "neutral" },
  pending_review: { label: "İncelemede", tone: "amber" },
  revision_requested: { label: "Düzenleme istendi", tone: "blue" },
  rejected: { label: "Reddedildi", tone: "red" },
  published: { label: "Yayımlandı", tone: "green" },
  closed: { label: "Kapalı", tone: "neutral" },
};

export const ANSWER_STATUS_CONFIG: Record<AnswerStatusKey, StatusConfig> = {
  published: { label: "Yayımlandı", tone: "green" },
  hidden: { label: "Gizlendi", tone: "amber" },
  deleted: { label: "Silindi", tone: "red" },
};

export function isQuestionStatusKey(value: string): value is QuestionStatusKey {
  return value in QUESTION_STATUS_CONFIG;
}

export function isAnswerStatusKey(value: string): value is AnswerStatusKey {
  return value in ANSWER_STATUS_CONFIG;
}
