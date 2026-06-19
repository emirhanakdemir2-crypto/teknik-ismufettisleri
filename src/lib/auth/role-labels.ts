import type { UserRole } from "@/lib/auth/roles";

const ROLE_LABELS: Record<UserRole, string> = {
  citizen: "Üye",
  inspector_pending: "Müfettiş Adayı",
  verified_inspector: "Doğrulanmış Müfettiş",
  moderator: "Moderatör",
  admin: "Yönetici",
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  citizen: "Soru gönderebilir ve kendi soru durumlarını takip edebilir.",
  inspector_pending: "Başvurusu inceleme aşamasında olan kullanıcı.",
  verified_inspector: "Yayımlanmış sorulara mesleki cevap verebilir.",
  moderator: "Soru ve cevapların yayın sürecini yönetebilir.",
  admin: "Moderasyon, başvuru ve sistem yönetimi yetkisine sahiptir.",
};

export function getRoleLabel(role: UserRole | null): string {
  if (!role) {
    return "Belirlenmedi";
  }

  return ROLE_LABELS[role];
}

export function getRoleDescription(role: UserRole | null): string {
  if (!role) {
    return "Hesap tipi belirlenmedi.";
  }

  return ROLE_DESCRIPTIONS[role];
}
