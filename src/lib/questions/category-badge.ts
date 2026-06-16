const CATEGORY_BADGES: Record<string, string> = {
  "is-sagligi-ve-guvenligi": "İSG",
  "calisma-sureleri": "Süre",
  "is-kazasi": "Kaza",
  "denetim-ve-mevzuat": "Kanun",
  "isveren-yukumlulukleri": "İşveren",
  "calisan-haklari": "Çalışan",
  diger: "Diğer",
};

export function getCategoryBadge(slug: string, title: string): string {
  const mapped = CATEGORY_BADGES[slug];
  if (mapped) {
    return mapped;
  }

  const firstWord = title.split(/\s+/)[0];
  return firstWord.length > 6 ? `${firstWord.slice(0, 5)}…` : firstWord;
}
