import type { UserRole } from "@/lib/auth/roles";

const ROLE_LABELS: Record<UserRole, string> = {
  citizen: "Vatandaş",
  inspector_pending: "Müfettiş adayı",
  verified_inspector: "Doğrulanmış müfettiş",
  moderator: "Moderatör",
  admin: "Yönetici",
};

export function getRoleLabel(role: UserRole | null): string {
  if (!role) {
    return "Belirlenmedi";
  }

  return ROLE_LABELS[role];
}
