---
name: ui-quality-review
description: Müfettişe Sor UI kalite incelemesi. DESIGN_MEMORY.md'ye göre fake stats, mock veri, boş dashboard ve AI landing hissini yakalar. UI değişikliği veya polish sprintinde kullan.
disable-model-invocation: true
paths: src/**/*.{tsx,css},docs/reference/design/**
---

# UI Quality Review — Müfettişe Sor

## Purpose

UI değişikliklerinin `docs/project/DESIGN_MEMORY.md` ve tasarım kurallarına uygunluğunu değerlendirmek; istenmeyen görsel kalıpları (fake data, mock admin, boş panel) erken yakalamak.

## When to use

- UI polish veya yeni sayfa sprinti sonunda
- Ana sayfa, `/account`, `/admin`, `/questions` değişikliğinde
- Kullanıcı “tasarım uygun mu?” diye sorduğunda
- Mock veya placeholder şüphesi olduğunda

## Required context files

- `docs/project/DESIGN_MEMORY.md`
- `docs/reference/design/design-notes.md`
- `src/app/globals.css`
- İlgili sayfa/component dosyaları

## Steps

1. Değişen UI dosyalarını listele (`src/app/`, `src/components/`).
2. DESIGN_MEMORY “Do not design like” listesini tek tek kontrol et:
   - AI landing / gradient hero
   - Fake istatistik veya sabit sayılar
   - Public mock admin kuyruğu
   - Boş dashboard (yalnızca 3 satır bilgi)
   - 2005 forum piksel kopyası
3. Veri kaynağı: sayılar ve listeler gerçek DB sorgusundan mı? (`getPublishedQuestions`, `getMyQuestions`, `getModerationDashboardStats`)
4. Mock dosya importu var mı? (`moderation-queue-mock.tsx` production'da kullanılmamalı)
5. Bileşen tutarlılığı: `PageHeader`, `ForumPanelTable`, `StatusBadge`, `EmptyState`, `archive-list`
6. Rol bazlı UI: admin/müfettiş linkleri yalnızca yetkili rollere
7. Mobil: `forum-table--responsive`, grid kırılımları, taşma
8. Türkçe metinler; erişilebilirlik (th scope, anlamlı link metni)

## Verification

- [ ] Fake stat yok
- [ ] Mock kuyruk public/admin'de kullanılmıyor
- [ ] Boş durumlar `EmptyState` + CTA ile dolu
- [ ] Panel/tablo stili mevcut convention ile uyumlu
- [ ] agaclar.net yalnızca IA referansı; görsel kopya yok

## Stop conditions

- Public sayfada hardcoded demo veri → düzeltme gerekir
- `moderation-queue-mock` import edilmiş → kaldırılmalı
- Tasarım DESIGN_MEMORY ile ciddi çelişiyor → kullanıcıya raporla

## Report format

```markdown
## UI Quality Review

### İncelenen ekranlar / dosyalar
- ...

### DESIGN_MEMORY uyumu
| Kural | Durum | Not |
|-------|-------|-----|

### Veri kaynağı
| Bileşen | Kaynak | Gerçek veri? |
|---------|--------|--------------|

### Bulgular
- **Düzeltilmeli:** ...
- **İyileştirme önerisi:** ...
- **Uygun:** ...

### Mobil / erişilebilirlik
- ...

### Öneri
- [ ] UI onaylı
- [ ] Revizyon gerekli: ...
```

## Forbidden actions

- UI kodu değiştirme (inceleme only; düzeltme ayrı sprint)
- Üçüncü parti site kodu kopyalama önerisi
- Yeni npm paketi ekleme önerisi (kullanıcı istemedikçe)
