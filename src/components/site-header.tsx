import Link from "next/link";

import { signOut } from "@/app/actions";
import { SiteLogo } from "@/components/brand/site-logo";
import { NotificationBellLink } from "@/components/notifications/notification-bell-link";
import { SiteNav } from "@/components/site-nav";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { buildHeaderNavItems } from "@/lib/navigation/header-nav";
import { getUnreadNotificationCount } from "@/lib/notifications/queries";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const navItems = buildHeaderNavItems(user?.role ?? null);
  const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

  return (
    <header className="site-header">
      <div className="site-header__inner site-container">
        <Link href="/" className="site-header__brand no-underline hover:no-underline">
          <SiteLogo variant="full" className="site-logo--header site-logo--header-full" />
          <SiteLogo variant="compact" className="site-logo--header site-logo--header-compact" />
        </Link>

        <SiteNav items={navItems} variant="inline" />

        <div className="site-header__actions">
          {user ? (
            <>
              <NotificationBellLink unreadCount={unreadCount} />
              <span
                className="site-header__user hidden md:inline"
                title={user.email}
              >
                {user.identity.primaryName}
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
