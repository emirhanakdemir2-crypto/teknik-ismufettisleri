import type { PostgrestError } from "@supabase/supabase-js";

export function mapModerationDbError(error: PostgrestError): string {
  const message = error.message.toLowerCase();
  const code = error.code;

  if (code === "42501" || message.includes("permission denied")) {
    return "Bu işlem için yetkiniz bulunmuyor.";
  }

  if (code === "PGRST116" || message.includes("0 rows")) {
    return "Soru bulunamadı veya güncellenemedi.";
  }

  return "Moderasyon işlemi tamamlanamadı. Lütfen tekrar deneyin.";
}
