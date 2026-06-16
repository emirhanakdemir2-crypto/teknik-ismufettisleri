import Link from "next/link";

import { signOut } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import { SiteNav } from "@/components/site-nav";

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

  return (
    <header className="border-b-2 border-[var(--header-accent)] bg-navy">
      <div className="site-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-3 no-underline hover:no-underline">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--header-accent)] bg-navy-dark text-[15px] font-bold text-white"
            aria-hidden="true"
          >
            Tİ
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-tight text-white">
              Teknik İşmüfettişleri Derneği
            </p>
            <p className="truncate text-[10px] text-[#a8b4c4]">
              teknikismufettisleri.org.tr — Müfettişe Sor
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {user ? (
            <>
              <span
                className="hidden max-w-[180px] truncate text-[10px] text-[#c0cad6] sm:inline"
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

      <div className="border-t border-[#1a2840] bg-cat-bar">
        <SiteNav isAuthenticated={Boolean(user)} />
      </div>
    </header>
  );
}
