"use server";

import { revalidatePath } from "next/cache";

import { mapAnswerDbError } from "@/lib/inspector/errors";
import { getPublishedQuestionForInspector } from "@/lib/inspector/queries";
import { getInspectorAccess } from "@/lib/auth/require-inspector";
import { canAnswerQuestion } from "@/lib/auth/roles";
import { createAnswerSchema } from "@/lib/schemas/answer";
import { createClient } from "@/lib/supabase/server";

export type AnswerActionState = {
  error?: string;
  success?: string;
};

export async function createAnswer(
  questionId: string,
  body: string,
): Promise<AnswerActionState> {
  const parsed = createAnswerSchema.safeParse({ questionId, body });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Geçersiz cevap bilgileri.",
    };
  }

  const access = await getInspectorAccess();

  if (!access.allowed) {
    return { error: "Bu işlem için giriş yapmanız ve müfettiş yetkiniz olmalıdır." };
  }

  if (!canAnswerQuestion(access.user.role)) {
    return { error: "Yalnızca doğrulanmış müfettişler cevap yazabilir." };
  }

  const question = await getPublishedQuestionForInspector(parsed.data.questionId);

  if (!question) {
    return { error: "Soru bulunamadı veya yayımlanmış durumda değil." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("answers").insert({
    question_id: parsed.data.questionId,
    author_id: access.user.id,
    body: parsed.data.body,
    status: "published",
  });

  if (error) {
    return { error: mapAnswerDbError(error) };
  }

  revalidatePath("/inspector");
  revalidatePath("/inspector/questions");
  revalidatePath(`/inspector/questions/${parsed.data.questionId}`);
  revalidatePath("/questions");
  revalidatePath(`/questions/${parsed.data.questionId}`);
  revalidatePath("/");

  return { success: "Cevabınız yayımlandı." };
}

export async function createAnswerFormAction(
  _prevState: AnswerActionState,
  formData: FormData,
): Promise<AnswerActionState> {
  const questionId = formData.get("questionId");
  const body = formData.get("body");

  if (typeof questionId !== "string" || typeof body !== "string") {
    return { error: "Geçersiz form verileri." };
  }

  return createAnswer(questionId, body);
}
