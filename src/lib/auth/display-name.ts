const MISSING_NAME_LABEL = "Profil adı belirtilmemiş";

function readMetadataString(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string | null {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

/** profiles + metadata only; e-posta prefix dahil değil. */
export function resolveProperDisplayName(
  profileDisplayName: string | null | undefined,
  metadata: Record<string, unknown> | undefined,
): string | null {
  const fromProfile = profileDisplayName?.trim();
  if (fromProfile) {
    return fromProfile;
  }

  return (
    readMetadataString(metadata, "full_name") ??
    readMetadataString(metadata, "display_name") ??
    readMetadataString(metadata, "name")
  );
}

export type UserIdentityDisplay = {
  /** UI'da gösterilecek birincil isim; e-posta prefix kullanılmaz. */
  primaryName: string;
  /** Yalnızca proper name yoksa true — raporlama / title ipucu için. */
  usesEmailFallback: boolean;
  email: string;
};

export function resolveUserIdentityDisplay(
  profileDisplayName: string | null | undefined,
  metadata: Record<string, unknown> | undefined,
  email: string,
): UserIdentityDisplay {
  const properName = resolveProperDisplayName(profileDisplayName, metadata);

  if (properName) {
    return {
      primaryName: properName,
      usesEmailFallback: false,
      email,
    };
  }

  return {
    primaryName: MISSING_NAME_LABEL,
    usesEmailFallback: true,
    email,
  };
}

/** Geriye dönük uyumluluk; e-posta prefix ana isim olarak dönmez. */
export function resolveUserDisplayName(
  profileDisplayName: string | null | undefined,
  metadata: Record<string, unknown> | undefined,
  email: string,
): string {
  return resolveUserIdentityDisplay(profileDisplayName, metadata, email).primaryName;
}

export { MISSING_NAME_LABEL };
