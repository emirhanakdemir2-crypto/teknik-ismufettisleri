"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminAccess } from "@/lib/auth/require-admin";
import { canReviewInspectorApplications } from "@/lib/auth/roles";
import {
  approveInspectorApplication,
  rejectInspectorApplication,
} from "@/lib/inspector/review-application";

export type InspectorApplicationActionState = {
  error?: string;
  success?: string;
};

const applicationIdSchema = z.string().uuid("Geçersiz başvuru kimliği.");

const rejectSchema = z.object({
  applicationId: z.string().uuid("Geçersiz başvuru kimliği."),
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Red gerekçesi en az 5 karakter olmalıdır.")
    .max(500, "Red gerekçesi en fazla 500 karakter olabilir."),
});

type ReviewAccessResult =
  | { ok: false; error: string }
  | { ok: true; actorId: string; applicationId: string };

async function assertCanReviewApplication(
  applicationId: string,
): Promise<ReviewAccessResult> {
  const access = await getAdminAccess();

  if (!access.allowed) {
    return { ok: false, error: "Bu işlem için giriş yapmanız ve yetkiniz olmalıdır." };
  }

  if (!canReviewInspectorApplications(access.user.role)) {
    return { ok: false, error: "Bu alana erişim yetkiniz yok." };
  }

  const parsedId = applicationIdSchema.safeParse(applicationId);

  if (!parsedId.success) {
    return {
      ok: false,
      error: parsedId.error.issues[0]?.message ?? "Geçersiz başvuru kimliği.",
    };
  }

  return {
    ok: true,
    actorId: access.user.id,
    applicationId: parsedId.data,
  };
}

export async function approveInspectorApplicationAction(
  _prevState: InspectorApplicationActionState,
  formData: FormData,
): Promise<InspectorApplicationActionState> {
  const applicationId = formData.get("applicationId");
  const reviewNoteRaw = formData.get("reviewNote");

  if (typeof applicationId !== "string") {
    return { error: "Geçersiz başvuru kimliği." };
  }

  const check = await assertCanReviewApplication(applicationId);

  if (!check.ok) {
    return { error: check.error };
  }

  const reviewNote =
    typeof reviewNoteRaw === "string" && reviewNoteRaw.trim().length > 0
      ? reviewNoteRaw.trim()
      : null;

  const result = await approveInspectorApplication(
    check.applicationId,
    check.actorId,
    reviewNote,
  );

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inspector-applications");
  revalidatePath("/account");
  revalidatePath("/inspector/apply");

  return { success: "Başvuru onaylandı; kullanıcı doğrulanmış müfettiş oldu." };
}

export async function rejectInspectorApplicationAction(
  _prevState: InspectorApplicationActionState,
  formData: FormData,
): Promise<InspectorApplicationActionState> {
  const parsed = rejectSchema.safeParse({
    applicationId: formData.get("applicationId"),
    rejectionReason: formData.get("rejectionReason"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Geçersiz red bilgileri.",
    };
  }

  const check = await assertCanReviewApplication(parsed.data.applicationId);

  if (!check.ok) {
    return { error: check.error };
  }

  const result = await rejectInspectorApplication(
    check.applicationId,
    check.actorId,
    parsed.data.rejectionReason,
  );

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inspector-applications");
  revalidatePath("/account");
  revalidatePath("/inspector/apply");

  return { success: "Başvuru reddedildi." };
}
