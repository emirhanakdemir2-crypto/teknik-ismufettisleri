export function resolveUserDisplayName(
  profileDisplayName: string | null | undefined,
  metadata: Record<string, unknown> | undefined,
  email: string,
): string {
  const fromProfile = profileDisplayName?.trim();
  if (fromProfile) {
    return fromProfile;
  }

  const fullName = metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName.trim();
  }

  const fromMetadata = metadata?.display_name;
  if (typeof fromMetadata === "string" && fromMetadata.trim().length > 0) {
    return fromMetadata.trim();
  }

  const atIndex = email.indexOf("@");
  return atIndex > 0 ? email.slice(0, atIndex) : email;
}
