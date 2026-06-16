export function formatDateTR(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
