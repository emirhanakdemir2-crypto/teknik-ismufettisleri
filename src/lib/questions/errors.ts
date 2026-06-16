import type { PostgrestError } from "@supabase/supabase-js";

export function mapQuestionDbError(error: PostgrestError): string {
  const message = error.message.toLowerCase();
  const code = error.code;

  if (code === "23514" || message.includes("check constraint")) {
    if (message.includes("title")) {
      return "Başlık uzunluğu geçerli aralıkta olmalıdır (10–200 karakter).";
    }

    if (message.includes("body")) {
      return "Soru metni en az 20 karakter olmalıdır.";
    }

    return "Girilen bilgiler geçerli değil. Lütfen kontrol edip tekrar deneyin.";
  }

  if (code === "42501" || message.includes("permission denied")) {
    return "Bu işlem için yetkiniz bulunmuyor. Giriş yaptığınızdan emin olun.";
  }

  if (code === "23503" || message.includes("foreign key")) {
    return "Seçilen kategori geçersiz. Lütfen sayfayı yenileyip tekrar deneyin.";
  }

  return "Soru gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";
}
