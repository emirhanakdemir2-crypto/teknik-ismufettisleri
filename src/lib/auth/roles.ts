export const USER_ROLES = [
  "citizen",
  "inspector_pending",
  "verified_inspector",
  "moderator",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type GuestQuestionContext = {
  isGuest: true;
  emailVerified: boolean;
};

export type AuthenticatedQuestionContext = {
  isGuest?: false;
  role: UserRole | null;
};

export type QuestionSubmitContext =
  | GuestQuestionContext
  | AuthenticatedQuestionContext;

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

/** Guest: e-posta doğrulandıysa; oturumlu: citizen ve üzeri roller soru gönderebilir. */
export function canSubmitQuestion(context: QuestionSubmitContext): boolean {
  if ("isGuest" in context && context.isGuest) {
    return context.emailVerified;
  }

  const role = context.role;
  if (!role) {
    return false;
  }

  return (
    role === "citizen" ||
    role === "inspector_pending" ||
    role === "verified_inspector" ||
    role === "moderator" ||
    role === "admin"
  );
}

/** Yalnızca doğrulanmış müfettiş mesleki cevap yazabilir; admin bu yetkiyi rolünden almaz. */
export function canAnswerQuestion(role: UserRole | null): boolean {
  return role === "verified_inspector";
}

/** Soru moderasyon kuyruğu: moderator ve admin. */
export function canModerateQuestions(role: UserRole | null): boolean {
  return role === "moderator" || role === "admin";
}

/** Müfettiş başvurusu inceleme yalnızca admin. */
export function canReviewInspectorApplications(role: UserRole | null): boolean {
  return role === "admin";
}

/** Private belge erişimi yalnızca admin; erişim audit log'a yazılır. */
export function canViewPrivateDocuments(role: UserRole | null): boolean {
  return role === "admin";
}
