export const PUBLIC_QUESTION_STATUSES = ["published", "closed"] as const;

export type PublicQuestionStatus = (typeof PUBLIC_QUESTION_STATUSES)[number];

export function isPublicQuestionStatus(
  status: string,
): status is PublicQuestionStatus {
  return (PUBLIC_QUESTION_STATUSES as readonly string[]).includes(status);
}
