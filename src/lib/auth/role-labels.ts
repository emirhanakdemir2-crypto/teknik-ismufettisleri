import type { UserRole } from "@/lib/auth/roles";

const ROLE_LABELS: Record<UserRole, string> = {
  citizen: "Vatandaş",
  inspector_pending: "Müfettiş adayı",
  verified_inspector: "Doğrulanmış müfettiş",
  moderator: "Moderatör",
  admin: "Yönetici",
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  citizen: "Vatandaş kullanıcı",
  admin: "Yönetici",
  moderator: "Moderatör",
  verified_inspector: "Doğrulanmış Müfettiş",
  inspector_pending: "Müfettiş başvurusu beklemede",
};

export function getRoleLabel(role: UserRole | null): string {
  if (!role) {
    return "Belirlenmedi";
  }

  return ROLE_LABELS[role];
}

export function getRoleDescription(role: UserRole | null): string {
  if (!role) {
    return "Hesap tipi belirlenmedi";
  }

  return ROLE_DESCRIPTIONS[role];
}
