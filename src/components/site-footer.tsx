import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#soru-sor", label: "Soru Sor" },
  { href: "/login", label: "Giriş" },
  { href: "/register", label: "Kayıt" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#1a2840] bg-navy px-3 py-4 text-center text-[10px] text-[#8a9bb0]">
      <p>© 2026 Teknik İşmüfettişleri Derneği — Kütük No: 06/161/039 — Ankara</p>
      <p className="mt-2 leading-relaxed">
        Müfettişe Sor: İş sağlığı ve güvenliği sorularınız için moderasyonlu,
        herkese açık bilgi bankası.
      </p>
      <p className="mt-2">
        {FOOTER_LINKS.map((link, index) => (
          <span key={link.href}>
            {index > 0 && <span className="mx-1 text-[#5a6a7a]">|</span>}
            <Link
              href={link.href}
              className="text-[#b0bcc8] no-underline hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </p>
    </footer>
  );
}
