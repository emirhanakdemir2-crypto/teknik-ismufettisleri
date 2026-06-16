import Link from "next/link";

import { signOut } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canAnswerQuestion, canModerateQuestions } from "@/lib/auth/roles";

import { SiteNav, type NavItem } from "@/components/site-nav";

function formatHeaderUserLabel(
  displayName: string | null,
  email: string,
): string {
  if (displayName) {
    return displayName;
  }

  const atIndex = email.indexOf("@");
  return atIndex > 0 ? email.slice(0, atIndex) : email;
}

export async function SiteHeader() {
  const user = await getCurrentUser();

  const roleNavItems: NavItem[] = [];

  if (user && canModerateQuestions(user.role)) {
    roleNavItems.push({ href: "/admin", label: "Yönetim", match: "prefix" });
  }

  if (user && canAnswerQuestion(user.role)) {
    roleNavItems.push({ href: "/inspector", label: "Müfettiş", match: "prefix" });
  }

  return (
    <header className="site-header">
      <div className="site-header__top">
        <Link href="/" className="site-header__brand no-underline hover:no-underline">
          <div className="site-header__logo" aria-hidden="true">
            Tİ
          </div>
          <div className="site-header__brand-text">
            <p className="site-header__org">Teknik İşmüfettişleri Derneği</p>
            <p className="site-header__product">teknikismufettisleri.org.tr — Müfettişe Sor</p>
          </div>
        </Link>

        <div className="site-header__auth">
          {user ? (
            <>
              <span
                className="site-header__user hidden sm:inline"
                title={user.email}
              >
                {formatHeaderUserLabel(user.displayName, user.email)}
              </span>
              <Link
                href="/account"
                className="btn btn-secondary text-[11px] no-underline hover:no-underline"
              >
                Hesabım
              </Link>
              <form action={signOut}>
                <button type="submit" className="btn btn-primary text-[11px]">
                  Çıkış
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-secondary text-[11px] no-underline hover:no-underline"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="btn btn-primary text-[11px] no-underline hover:no-underline"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="site-header__nav">
        <SiteNav isAuthenticated={Boolean(user)} roleNavItems={roleNavItems} />
      </div>
    </header>
  );
}
