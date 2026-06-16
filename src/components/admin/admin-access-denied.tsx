import Link from "next/link";

export function AdminAccessDenied() {
  return (
    <div className="site-container py-8">
      <div className="site-panel max-w-xl">
        <div className="site-panel__head">Erişim reddedildi</div>
        <div className="site-panel__body">
          <p className="text-[12px] leading-relaxed text-text">
            Bu alana erişim yetkiniz yok. Yalnızca moderatör ve yönetici hesapları
            moderasyon paneline erişebilir.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/" className="btn btn-secondary no-underline hover:no-underline">
              Ana sayfa
            </Link>
            <Link href="/account" className="btn btn-secondary no-underline hover:no-underline">
              Hesabım
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
