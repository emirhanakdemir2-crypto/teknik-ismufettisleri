import Link from "next/link";

import type { CurrentUser } from "@/lib/auth/get-current-user";
import {
  canAnswerQuestion,
  canModerateQuestions,
  canReviewInspectorApplications,
} from "@/lib/auth/roles";
import {
  hasPendingInspectorApplication,
  hasRejectedInspectorApplication,
} from "@/lib/inspector/application-record";

export type AccountQuickLink = {
  href: string;
  title: string;
  description: string;
  emphasis?: boolean;
};

import { hasSubmittedInspectorApplication } from "@/lib/inspector/application-metadata";

function citizenLinks(user: CurrentUser): AccountQuickLink[] {
  if (
    hasPendingInspectorApplication(user.inspectorApplicationRecord) ||
    hasSubmittedInspectorApplication(user.inspectorApplication)
  ) {
    return pendingInspectorLinks();
  }

  if (hasRejectedInspectorApplication(user.inspectorApplicationRecord)) {
    return [
      {
        href: "/inspector/apply",
        title: "Başvuru Durumu",
        description: "Reddedilen başvurunuzun gerekçesini görüntüleyin.",
      },
      {
        href: "/questions",
        title: "Yayınlanan Sorular",
        description: "Yayımlanmış soruları ve müfettiş cevaplarını okuyun.",
      },
    ];
  }

  return [
    {
      href: "/ask",
      title: "Soru Sor",
      description: "İş sağlığı ve güvenliği sorunuzu müfettişlere iletin.",
      emphasis: true,
    },
    {
      href: "/account#benim-sorularim",
      title: "Sorularım",
      description: "Gönderdiğiniz soruların durumunu takip edin.",
    },
    {
      href: "/questions",
      title: "Yayınlanan Sorular",
      description: "Yayımlanmış soruları ve müfettiş cevaplarını okuyun.",
    },
    {
      href: "/inspector/apply",
      title: "Müfettiş olarak başvur",
      description: "Doğrulanmış müfettiş olarak mesleki cevap vermek için başvurun.",
    },
  ];
}

function pendingInspectorLinks(): AccountQuickLink[] {
  return [
    {
      href: "/inspector/apply",
      title: "Başvuru Durumu",
      description: "Müfettişlik başvurunuzun inceleme durumunu görüntüleyin.",
      emphasis: true,
    },
    {
      href: "/questions",
      title: "Yayınlanan Sorular",
      description: "Yayımlanmış soruları ve müfettiş cevaplarını okuyun.",
    },
    {
      href: "/account",
      title: "Hesabım",
      description: "Hesap bilgilerinizi ve üyelik özetinizi görüntüleyin.",
    },
  ];
}

function verifiedInspectorLinks(): AccountQuickLink[] {
  return [
    {
      href: "/inspector",
      title: "Müfettiş Paneli",
      description: "Cevap yazma ve müfettiş işlemleri özeti.",
      emphasis: true,
    },
    {
      href: "/inspector/questions",
      title: "Cevap Bekleyen Sorular",
      description: "Yayındaki ve henüz cevaplanmamış sorular.",
    },
    {
      href: "/questions",
      title: "Yayınlanan Sorular",
      description: "Yayımlanmış soruları ve müfettiş cevaplarını okuyun.",
    },
  ];
}

function staffLinks(user: CurrentUser, stats: StaffLinkStats): AccountQuickLink[] {
  const links: AccountQuickLink[] = [
    {
      href: "/admin",
      title: "Yönetim Paneli",
      description: "Moderasyon özeti ve yönetim araçları.",
      emphasis: true,
    },
    {
      href: "/admin/questions",
      title: "Moderasyon Kuyruğu",
      description: `İnceleme bekleyen ${stats.pendingCount} soru.`,
    },
    {
      href: "/questions",
      title: "Yayındaki Sorular",
      description: `Yayımlanmış ${stats.publishedCount} soru.`,
    },
  ];

  if (canReviewInspectorApplications(user.role)) {
    links.push({
      href: "/admin/inspector-applications",
      title: "Müfettiş Başvuruları",
      description:
        stats.pendingApplications > 0
          ? `${stats.pendingApplications} başvuru inceleme bekliyor.`
          : "İncelemede müfettiş başvurusu yok.",
    });
  }

  return links;
}

export type StaffLinkStats = {
  pendingCount: number;
  publishedCount: number;
  rejectedCount: number;
  pendingApplications: number;
};

export function buildAccountQuickLinks(
  user: CurrentUser,
  stats?: StaffLinkStats,
): AccountQuickLink[] {
  const { role } = user;

  if (canModerateQuestions(role) && stats) {
    return staffLinks(user, stats);
  }

  if (canAnswerQuestion(role)) {
    return verifiedInspectorLinks();
  }

  if (role === "inspector_pending" || hasPendingInspectorApplication(user.inspectorApplicationRecord)) {
    return pendingInspectorLinks();
  }

  return citizenLinks(user);
}

export function AccountQuickLinksGrid({ links }: { links: AccountQuickLink[] }) {
  return (
    <div className="account-quick-grid">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`account-quick-link no-underline hover:no-underline ${
            link.emphasis ? "account-quick-link--emphasis" : ""
          }`}
        >
          <span className="account-quick-link__title">{link.title}</span>
          <span className="account-quick-link__text">{link.description}</span>
        </Link>
      ))}
    </div>
  );
}
