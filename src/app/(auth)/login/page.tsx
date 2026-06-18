import { LoginForm } from "@/app/(auth)/login/login-form";

const NOTICES: Record<string, string> = {
  "email-confirmation":
    "Kayıt işleminiz alındı. Giriş yapmadan önce e-posta adresinizi doğrulamanız gerekiyor.",
  "inspector-email-confirmation":
    "Müfettiş başvuru kaydınız alındı. E-posta doğrulamasından sonra giriş yaparak başvuru durumunuzu takip edebilirsiniz.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; next?: string }>;
}) {
  const params = await searchParams;
  const notice = params.notice ? (NOTICES[params.notice] ?? null) : null;
  const next = params.next?.startsWith("/") ? params.next : null;

  return <LoginForm notice={notice} next={next} />;
}
