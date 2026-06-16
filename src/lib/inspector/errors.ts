import type { PostgrestError } from "@supabase/supabase-js";

export function mapAnswerDbError(error: PostgrestError): string {
  const message = error.message.toLowerCase();
  const code = error.code;

  if (code === "23514" || message.includes("check constraint")) {
    if (message.includes("body")) {
      return "Cevap metni en az 20 karakter olmalıdır.";
    }

    return "Girilen bilgiler geçerli değil. Lütfen kontrol edip tekrar deneyin.";
  }

  if (code === "42501" || message.includes("permission denied")) {
    return "Bu işlem için yetkiniz bulunmuyor. Yalnızca doğrulanmış müfettişler cevap yazabilir.";
  }

  if (code === "23503" || message.includes("foreign key")) {
    return "Soru bulunamadı veya artık cevap kabul etmiyor.";
  }

  return "Cevap gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";
}
