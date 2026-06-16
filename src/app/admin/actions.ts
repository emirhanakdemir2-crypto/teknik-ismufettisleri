"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { mapModerationDbError } from "@/lib/admin/errors";
import { getQuestionForModeration } from "@/lib/admin/queries";
import { getModeratorAccess } from "@/lib/auth/require-moderator";
import { canModerateQuestions } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export type ModerationActionState = {
  error?: string;
  success?: string;
};

const questionIdSchema = z.string().uuid("Geçersiz soru kimliği.");

const rejectSchema = z.object({
  questionId: z.string().uuid("Geçersiz soru kimliği."),
  moderationNote: z
    .string()
    .trim()
    .min(5, "Red gerekçesi en az 5 karakter olmalıdır.")
    .max(500, "Red gerekçesi en fazla 500 karakter olabilir."),
});

async function assertCanModeratePendingQuestion(questionId: string) {
  const access = await getModeratorAccess();

  if (!access.allowed) {
    return { error: "Bu işlem için giriş yapmanız ve yetkiniz olmalıdır." };
  }

  if (!canModerateQuestions(access.user.role)) {
    return { error: "Bu alana erişim yetkiniz yok." };
  }

  const question = await getQuestionForModeration(questionId);

  if (!question) {
    return { error: "Soru bulunamadı." };
  }

  if (question.status !== "pending_review") {
    return { error: "Yalnızca inceleme bekleyen sorular moderasyon edilebilir." };
  }

  return { error: null as string | null, actorId: access.user.id };
}

export async function publishQuestion(
  questionId: string,
): Promise<ModerationActionState> {
  const parsedId = questionIdSchema.safeParse(questionId);

  if (!parsedId.success) {
    return { error: parsedId.error.issues[0]?.message ?? "Geçersiz soru kimliği." };
  }

  const check = await assertCanModeratePendingQuestion(parsedId.data);

  if (check.error) {
    return { error: check.error };
  }

  const supabase = await createClient();
  const publishedAt = new Date().toISOString();

  const { error } = await supabase
    .from("questions")
    .update({
      status: "published",
      published_at: publishedAt,
    })
    .eq("id", parsedId.data)
    .eq("status", "pending_review");

  if (error) {
    return { error: mapModerationDbError(error) };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/questions");
  revalidatePath("/questions");
  revalidatePath("/");

  return { success: "Soru yayımlandı." };
}

export async function rejectQuestion(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const parsed = rejectSchema.safeParse({
    questionId: formData.get("questionId"),
    moderationNote: formData.get("moderationNote"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Geçersiz red bilgileri.",
    };
  }

  const check = await assertCanModeratePendingQuestion(parsed.data.questionId);

  if (check.error) {
    return { error: check.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("questions")
    .update({
      status: "rejected",
      moderation_note: parsed.data.moderationNote,
    })
    .eq("id", parsed.data.questionId)
    .eq("status", "pending_review");

  if (error) {
    return { error: mapModerationDbError(error) };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/questions");

  return { success: "Soru reddedildi." };
}

export async function publishQuestionFormAction(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const questionId = formData.get("questionId");

  if (typeof questionId !== "string") {
    return { error: "Geçersiz soru kimliği." };
  }

  return publishQuestion(questionId);
}
