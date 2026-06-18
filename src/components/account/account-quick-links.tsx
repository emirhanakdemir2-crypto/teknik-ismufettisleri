import Link from "next/link";

import type { CurrentUser } from "@/lib/auth/get-current-user";
import { canAnswerQuestion, canModerateQuestions } from "@/lib/auth/roles";
import { hasSubmittedInspectorApplication } from "@/lib/inspector/application-metadata";

type QuickLink = {
  href: string;
  title: string;
  description: string;
};

type AccountQuickLinksProps = {
  user: CurrentUser;
};

function buildInspectorLinks(user: CurrentUser): QuickLink[] {
  const { role, inspectorApplication } = user;

  if (canAnswerQuestion(role)) {
    return [];
  }

  if (
    role === "inspector_pending" ||
    (role === "citizen" && hasSubmittedInspectorApplication(inspectorApplication))
  ) {
    return [
      {
        href: "/inspector/apply",
        title: "Başvuru durumum: İncelemede",
        description: "Müfettişlik başvurunuzun durumunu görüntüleyin.",
      },
    ];
  }

  if (role === "citizen") {
    return [
      {
        href: "/register/inspector",
        title: "Müfettiş olarak kayıt ol / başvur",
        description: "İş müfettişi veya yetkili uzman olarak başvuru yapın.",
      },
    ];
  }

  return [];
}

function buildQuickLinks(user: CurrentUser): QuickLink[] {
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

  links.push(...buildInspectorLinks(user));

  if (canModerateQuestions(user.role)) {
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

  if (canAnswerQuestion(user.role)) {
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

export function AccountQuickLinks({ user }: AccountQuickLinksProps) {
  const links = buildQuickLinks(user);

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
