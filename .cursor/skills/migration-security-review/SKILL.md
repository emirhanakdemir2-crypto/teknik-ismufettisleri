---
name: migration-security-review
description: Müfettişe Sor Supabase migration güvenlik incelemesi. supabase/migrations değiştiğinde, migration push öncesinde veya SQL güvenlik review istendiğinde kullan. Read-only.
disable-model-invocation: true
paths: supabase/**/*.sql
---

# Migration Security Review — Müfettişe Sor

## Purpose

`supabase/migrations/` altındaki SQL değişikliklerini güvenlik ve iş kuralı uyumu açısından incelemek. Push öncesi RLS, trigger ve `SECURITY DEFINER` risklerini yakalamak.

## When to use

- Yeni veya değiştirilmiş migration dosyası eklendiğinde
- Kullanıcı migration push öncesi review istediğinde
- RLS/policy/trigger değişikliği şüphesi olduğunda

## Required context files

- `.cursor/rules/10-migration-safety.mdc`
- `.cursor/rules/02-database-schema.mdc`
- `.cursor/rules/03-auth-and-roles.mdc`
- `supabase/migrations/001_initial_schema.sql` (mevcut policy referansı)
- `docs/project/STATE.md`

## Steps

1. İncelenecek SQL dosyalarını listele (`supabase/migrations/*.sql`).
2. `.cursor/rules/10-migration-safety.mdc` checklist maddelerini tek tek işaretle.
3. RLS policy değişikliklerini doğrula:
   - `questions_select_published` — yalnızca `published`/`closed`
   - `questions_select_own` — `auth.uid() = author_id`
   - `questions_select_moderation_queue` — `is_moderator_or_admin()`
   - Answer INSERT — yalnızca `verified_inspector`
4. Trigger ve `SECURITY DEFINER` fonksiyonları: `search_path = public` var mı?
5. Bootstrap migration'lar (`003`, `004`): production riski not et.
6. GRANT/REVOKE: anon/authenticated aşırı yetki var mı?
7. Riskleri sınıflandır: **kritik** / **orta** / **düşük**.
8. Net tavsiye ver: push edilebilir / push edilmemeli.

## Verification

- [ ] Tüm değişen migration dosyaları listelendi
- [ ] RLS her public tabloda gözden geçirildi
- [ ] İş kuralları (admin cevap yazamaz, closed'a cevap yok) korunuyor
- [ ] Bootstrap production riski belirtildi

## Stop conditions

- Kritik RLS açığı tespit edildi → push edilmemeli
- Policy ile ürün tanımı çelişiyor → kullanıcıya raporla, dur
- Migration sıra numarası çakışması → dur

## Report format

```markdown
## Migration Security Review

### İncelenen dosyalar
- ...

### Checklist sonucu
| Madde | Durum | Not |
|-------|-------|-----|

### RLS özeti
- questions: ...
- answers: ...
- profiles: ...

### Riskler
- **Kritik:** ...
- **Orta:** ...
- **Düşük:** ...

### Tavsiye
- [ ] Push edilebilir
- [ ] Push edilmemeli — önce düzelt: ...

### Migration sonrası (kullanıcı)
- `npx supabase gen types typescript --linked` (types güncelleme)
```

## Forbidden actions

- `supabase db push`, `supabase db reset` veya uzak DB komutu
- `.env.local` okuma veya secret/PAT/service role key isteme
- Migration dosyasını bu skill içinde otomatik düzenleme (rapor ver; düzeltme ayrı sprint)
