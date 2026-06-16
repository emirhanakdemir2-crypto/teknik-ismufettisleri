const MAX_SEARCH_LENGTH = 100;

export function normalizeSearchQuery(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value.trim().slice(0, MAX_SEARCH_LENGTH);
}

export function escapeIlikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

export function isSearchQueryValid(value: string): boolean {
  return value.trim().length >= 2;
}
