import type { AuthError } from "@supabase/supabase-js";

export function mapAuthError(error: AuthError): string {
  const message = error.message.toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "E-posta veya şifre hatalı.";
  }

  if (message.includes("email not confirmed")) {
    return "E-posta adresinizi doğrulamanız gerekiyor. Gelen kutunuzu kontrol edin.";
  }

  if (
    message.includes("user already registered") ||
    message.includes("already been registered")
  ) {
    return "Bu e-posta adresi zaten kayıtlı.";
  }

  if (message.includes("password") && message.includes("at least")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }

  if (message.includes("signup is disabled")) {
    return "Kayıt işlemi şu anda kapalı. Lütfen daha sonra tekrar deneyin.";
  }

  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.";
  }

  return "İşlem başarısız. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";
}
