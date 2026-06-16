"use server";

import { mapQuestionDbError } from "@/lib/questions/errors";
import { submitQuestionSchema } from "@/lib/schemas/question";
import { createClient } from "@/lib/supabase/server";

export type AskActionState = {
  error?: string;
  success?: string;
};

const SUCCESS_MESSAGE =
  "Sorunuz incelemeye alındı. Yayınlanmadan önce moderasyon kontrolünden geçecektir.";

export async function submitQuestion(
  _prevState: AskActionState,
  formData: FormData,
): Promise<AskActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Soru göndermek için giriş yapmanız gerekiyor." };
  }

  const parsed = submitQuestionSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Geçersiz soru bilgileri.",
    };
  }

  const { title, body, categoryId } = parsed.data;

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (categoryError || !category) {
    return {
      error:
        "Seçilen kategori geçersiz veya pasif. Lütfen sayfayı yenileyip tekrar deneyin.",
    };
  }

  const { error } = await supabase.from("questions").insert({
    author_id: user.id,
    category_id: categoryId,
    title,
    body,
    status: "pending_review",
  });

  if (error) {
    return { error: mapQuestionDbError(error) };
  }

  return { success: SUCCESS_MESSAGE };
}
