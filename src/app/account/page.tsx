import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/actions";
import { AuthCard } from "@/components/auth-card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getRoleLabel } from "@/lib/auth/role-labels";
import { canAnswerQuestion, canModerateQuestions } from "@/lib/auth/roles";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="auth-page">
      <div className="site-container auth-page__inner auth-page__inner--wide">
        <AuthCard
          title="Hesabım"
          subtitle="Hesap bilgileriniz aşağıda görüntülenir. Rol bilgisi değiştirilemez."
        >
          <table className="account-dl">
            <tbody>
              <tr>
                <th scope="row">E-posta</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th scope="row">Görünen ad</th>
                <td>{user.displayName ?? "—"}</td>
              </tr>
              <tr>
                <th scope="row">Rol</th>
                <td>{getRoleLabel(user.role)}</td>
              </tr>
            </tbody>
          </table>

          {canModerateQuestions(user.role) && (
            <p className="mt-4 text-[12px]">
              <Link href="/admin" className="text-link hover:underline">
                Yönetim paneline git
              </Link>
            </p>
          )}

          {canAnswerQuestion(user.role) && (
            <p className="mt-4 text-[12px]">
              <Link href="/inspector" className="text-link hover:underline">
                Müfettiş paneline git
              </Link>
            </p>
          )}

          <form action={signOut} className="mt-6">
            <button type="submit" className="btn btn-secondary">
              Çıkış Yap
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
