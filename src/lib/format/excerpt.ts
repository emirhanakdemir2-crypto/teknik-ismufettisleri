const DEFAULT_MAX_LENGTH = 160;

export function excerptText(
  text: string,
  maxLength: number = DEFAULT_MAX_LENGTH,
): string {
  const normalized = text.trim().replace(/\s+/g, " ");

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
