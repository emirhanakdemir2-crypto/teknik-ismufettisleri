import type { UserRole } from "@/lib/auth/roles";

const ROLE_LABELS: Record<UserRole, string> = {
  citizen: "Kayıtlı Kullanıcı",
  inspector_pending: "Müfettiş Başvurusu İncelemede",
  verified_inspector: "Doğrulanmış Müfettiş",
  moderator: "Moderatör",
  admin: "Yönetici",
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  citizen: "Soru sorabilen kayıtlı kullanıcı",
  admin: "Sistem yönetim yetkisine sahip kullanıcı",
  moderator: "Soru ve cevapları inceleyebilen yetkili kullanıcı",
  verified_inspector: "Doğrulanmış müfettiş hesabı",
  inspector_pending: "Müfettişlik başvurusu inceleme aşamasında olan kullanıcı",
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
