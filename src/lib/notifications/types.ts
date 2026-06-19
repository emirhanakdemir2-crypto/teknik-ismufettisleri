export const NOTIFICATION_TYPES = {
  QUESTION_ANSWER_PUBLISHED: "question_answer_published",
  QUESTION_PUBLISHED: "question_published",
  QUESTION_PENDING_REVIEW: "question_pending_review",
  INSPECTOR_APPLICATION_PENDING: "inspector_application_pending",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type NotificationPayload = {
  title: string;
  body: string;
  href: string;
  questionId?: string;
  answerId?: string;
  applicationId?: string;
};

export type NotificationItem = {
  id: string;
  type: NotificationType;
  payload: NotificationPayload;
  readAt: string | null;
  createdAt: string;
};
