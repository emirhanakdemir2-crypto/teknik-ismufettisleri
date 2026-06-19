import type { NavItem } from "@/components/site-nav";
import {
  canAnswerQuestion,
  canModerateQuestions,
  type UserRole,
} from "@/lib/auth/roles";

const BASE_NAV: NavItem[] = [
  { href: "/", label: "Ana Sayfa", match: "exact" },
  { href: "/questions", label: "Sorular", match: "prefix" },
  { href: "/categories", label: "Kategoriler", match: "prefix" },
];

export function buildHeaderNavItems(role: UserRole | null): NavItem[] {
  if (!role) {
    return [
      ...BASE_NAV,
      { href: "/ask", label: "Soru Sor", match: "path" },
      { href: "/register/inspector", label: "Müfettiş Başvurusu", match: "path" },
    ];
  }

  if (canModerateQuestions(role)) {
    return [...BASE_NAV, { href: "/admin", label: "Yönetim", match: "prefix" }];
  }

  if (canAnswerQuestion(role)) {
    return [
      ...BASE_NAV,
      { href: "/inspector", label: "Müfettiş Paneli", match: "prefix" },
    ];
  }

  if (role === "inspector_pending") {
    return BASE_NAV;
  }

  return [...BASE_NAV, { href: "/ask", label: "Soru Sor", match: "path" }];
}
