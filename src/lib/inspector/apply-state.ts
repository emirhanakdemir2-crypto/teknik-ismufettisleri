import type { UserRole } from "@/lib/auth/roles";
import { canAnswerQuestion, canModerateQuestions } from "@/lib/auth/roles";
import {
  hasSubmittedInspectorApplication,
  type InspectorApplicationMetadata,
} from "@/lib/inspector/application-metadata";

export type InspectorApplyView =
  | "guest"
  | "verified"
  | "pending_review"
  | "staff"
  | "form"
  | "complete_metadata";

export function resolveInspectorApplyView(
  role: UserRole | null,
  application: InspectorApplicationMetadata,
): InspectorApplyView {
  if (!role) {
    return "guest";
  }

  if (canAnswerQuestion(role)) {
    return "verified";
  }

  if (role === "inspector_pending") {
    return "pending_review";
  }

  if (canModerateQuestions(role)) {
    return "staff";
  }

  if (hasSubmittedInspectorApplication(application)) {
    return "complete_metadata";
  }

  return "form";
}
