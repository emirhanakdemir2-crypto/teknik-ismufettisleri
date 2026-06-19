import type { UserRole } from "@/lib/auth/roles";
import { canAnswerQuestion, canModerateQuestions } from "@/lib/auth/roles";
import type { InspectorApplicationRecord } from "@/lib/inspector/application-record";
import {
  hasPendingInspectorApplication,
  hasRejectedInspectorApplication,
} from "@/lib/inspector/application-record";
import {
  hasSubmittedInspectorApplication,
  type InspectorApplicationMetadata,
} from "@/lib/inspector/application-metadata";

export type InspectorApplyView =
  | "guest"
  | "verified"
  | "pending_review"
  | "rejected"
  | "staff"
  | "form"
  | "complete_metadata";

export function resolveInspectorApplyView(
  role: UserRole | null,
  metadata: InspectorApplicationMetadata,
  dbApplication: InspectorApplicationRecord | null,
): InspectorApplyView {
  if (!role) {
    return "guest";
  }

  if (canAnswerQuestion(role)) {
    return "verified";
  }

  if (role === "inspector_pending" || hasPendingInspectorApplication(dbApplication)) {
    return "pending_review";
  }

  if (canModerateQuestions(role)) {
    return "staff";
  }

  if (hasRejectedInspectorApplication(dbApplication)) {
    return "rejected";
  }

  if (hasSubmittedInspectorApplication(metadata)) {
    return "complete_metadata";
  }

  return "form";
}
