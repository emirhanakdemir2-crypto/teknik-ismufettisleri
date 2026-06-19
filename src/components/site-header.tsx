import Link from "next/link";

import { signOut } from "@/app/actions";
import { SiteLogo } from "@/components/brand/site-logo";
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
      <div className="site-header__inner site-container">
        <Link href="/" className="site-header__brand no-underline hover:no-underline">
          <SiteLogo variant="full" className="site-logo--header site-logo--header-full" />
          <SiteLogo variant="compact" className="site-logo--header site-logo--header-compact" />
        </Link>

        <SiteNav
          isAuthenticated={Boolean(user)}
          roleNavItems={roleNavItems}
          variant="inline"
        />

        <div className="site-header__actions">
          {user ? (
            <>
              <span className="site-header__user hidden md:inline" title={user.email}>
                {formatHeaderUserLabel(user.displayName, user.email)}
              </span>
              <Link
                href="/account"
                className="site-header__btn site-header__btn--ghost no-underline hover:no-underline"
              >
                Hesabım
              </Link>
              <form action={signOut}>
                <button type="submit" className="site-header__btn site-header__btn--primary">
                  Çıkış
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="site-header__btn site-header__btn--ghost no-underline hover:no-underline"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="site-header__btn site-header__btn--primary no-underline hover:no-underline"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
