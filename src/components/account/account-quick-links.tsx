import Link from "next/link";

import type { UserRole } from "@/lib/auth/roles";
import { canAnswerQuestion, canModerateQuestions } from "@/lib/auth/roles";

type QuickLink = {
  href: string;
  title: string;
  description: string;
};

type AccountQuickLinksProps = {
  role: UserRole | null;
};

function buildQuickLinks(role: UserRole | null): QuickLink[] {
  const links: QuickLink[] = [
    {
      href: "/ask",
      title: "Soru Sor",
      description: "İş sağlığı ve güvenliği sorunuzu müfettişlere iletin.",
    },
    {
      href: "/questions",
      title: "Yayınlanan Sorular",
      description: "Yayımlanmış soruları ve müfettiş cevaplarını okuyun.",
    },
    {
      href: "/account#benim-sorularim",
      title: "Benim Sorularım",
      description: "Gönderdiğiniz soruların durumunu bu sayfada takip edin.",
    },
  ];

  if (canModerateQuestions(role)) {
    links.push(
      {
        href: "/admin",
        title: "Yönetim Paneli",
        description: "Moderasyon özeti ve yönetim araçları.",
      },
      {
        href: "/admin/questions",
        title: "Moderasyon Kuyruğu",
        description: "İnceleme bekleyen soruları onaylayın veya reddedin.",
      },
    );
  }

  if (canAnswerQuestion(role)) {
    links.push(
      {
        href: "/inspector",
        title: "Müfettiş Paneli",
        description: "Cevap yazma ve müfettiş işlemleri özeti.",
      },
      {
        href: "/inspector/questions",
        title: "Cevap Bekleyen Sorular",
        description: "Yayındaki ve henüz cevaplanmamış sorular.",
      },
    );
  }

  return links;
}

export function AccountQuickLinks({ role }: AccountQuickLinksProps) {
  const links = buildQuickLinks(role);

  return (
    <div className="account-quick-grid">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="account-quick-link no-underline hover:no-underline"
        >
          <span className="account-quick-link__title">{link.title}</span>
          <span className="account-quick-link__text">{link.description}</span>
        </Link>
      ))}
    </div>
  );
}
