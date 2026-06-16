import Link from "next/link";

import { SiteNav } from "@/components/site-nav";

export function SiteHeader() {
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
          <Link href="/login" className="btn btn-secondary text-[11px] no-underline hover:no-underline">
            Giriş
          </Link>
          <Link
            href="/register"
            className="btn btn-primary text-[11px] no-underline hover:no-underline"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>

      <div className="border-t border-[#1a2840] bg-cat-bar">
        <SiteNav />
      </div>
    </header>
  );
}
