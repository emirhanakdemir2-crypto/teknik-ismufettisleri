import { LoginForm } from "@/app/(auth)/login/login-form";

const EMAIL_CONFIRMATION_NOTICE =
  "Kayıt işleminiz alındı. Giriş yapmadan önce e-posta adresinizi doğrulamanız gerekiyor.";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const notice =
    params.notice === "email-confirmation" ? EMAIL_CONFIRMATION_NOTICE : null;

  return <LoginForm notice={notice} />;
}
