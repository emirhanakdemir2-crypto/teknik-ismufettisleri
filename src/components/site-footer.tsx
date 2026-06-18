import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/questions", label: "Sorular" },
  { href: "/ask", label: "Soru Sor" },
  { href: "/login", label: "Giriş" },
  { href: "/register", label: "Kayıt" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer__text">
        © 2026 Teknik İşmüfettişleri Derneği — Kütük No: 06/161/039 — Ankara
      </p>
      <p className="site-footer__text site-footer__text--muted">
        Müfettişe Sor: İş sağlığı ve güvenliği sorularınız için moderasyonlu,
        herkese açık bilgi bankası.
      </p>
      <p className="site-footer__legal">
        Cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı karar
        niteliği taşımaz.
      </p>
      <p className="site-footer__links">
        {FOOTER_LINKS.map((link, index) => (
          <span key={link.href}>
            {index > 0 && <span className="site-footer__separator">|</span>}
            <Link href={link.href} className="site-footer__link">
              {link.label}
            </Link>
          </span>
        ))}
      </p>
    </footer>
  );
}
