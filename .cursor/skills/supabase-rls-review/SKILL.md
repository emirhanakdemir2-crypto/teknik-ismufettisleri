---
name: supabase-rls-review
description: Müfettişe Sor RLS ve Supabase erişim modeli incelemesi. Auth, yetki, public/private veri ayrımı veya service role şüphesi olduğunda kullan. Read-only.
disable-model-invocation: true
paths: src/**/*.{ts,tsx},supabase/**/*.sql
---

# Supabase RLS Review — Müfettişe Sor

## Purpose

Uygulama kodunun ve migration policy'lerinin RLS ile uyumunu doğrulamak; `auth.uid()`, rol kontrolleri, public/private veri sızıntısı ve service role kullanımını denetlemek.

## When to use

- Yeni sorgu veya server action eklendiğinde
- Kullanıcı “başkasının verisini görebilir mi?” sorusu sorduğunda
- Account, admin, inspector veya public listeleme değişikliğinde
- `src/lib/supabase/` veya `src/lib/auth/` değişikliğinde

## Required context files

- `supabase/migrations/001_initial_schema.sql` (policy source of truth)
- `.cursor/rules/03-auth-and-roles.mdc`
- `src/lib/auth/roles.ts`
- `docs/project/TEST_MATRIX.md`
- `docs/project/STATE.md`

## Steps

1. Değişen dosyalarda Supabase client tipini belirle:
   - `createClient()` from `@/lib/supabase/server` — anon + user session (tercih)
   - `createClient()` from `@/lib/supabase/client` — browser (yalnızca public + own data)
   - `@/lib/supabase/admin` — **service role; MVP'de import edilmemeli**
2. Her SELECT sorgusu için hangi RLS policy'nin geçerli olduğunu eşle:
   - Public listeler → `questions_select_published`
   - Kendi sorularım → `questions_select_own` + `.eq('author_id', userId)`
   - Moderasyon → `questions_select_moderation_queue` + `requireModeratorAccess()`
3. `auth.uid()` kullanımı: client'tan gelen `userId` parametresine körü körüne güvenilmediğini doğrula; server'da `getUser()` ile oturumdan alınmalı.
4. INSERT/UPDATE/DELETE: ilgili policy + server action rol kontrolü (`canModerateQuestions`, `canAnswerQuestion`).
5. Public detay linkleri: yalnızca `published`/`closed` sorulara verilmeli (`src/components/account/my-questions-section.tsx` pattern).
6. Raw Supabase error kullanıcıya gösteriliyor mu? (`src/lib/*/errors.ts` pattern)
7. Service role grep: `admin.ts`, `SERVICE_ROLE`, `service_role` importları.

## Verification

- [ ] Service role client component'te import edilmiyor
- [ ] Kullanıcı yalnızca kendi non-public sorularını görebiliyor
- [ ] Guest pending/rejected soru göremiyor
- [ ] Admin cevap INSERT yok (`canAnswerQuestion` false)
- [ ] Moderator belge erişimi yok

## Stop conditions

- RLS yetersiz ve migration sprintte yasak → dur ve raporla
- `admin.ts` client'ta import edilmiş → kritik; düzeltme gerekir
- Sorgu `author_id` filtresi olmadan non-public veri çekiyor → risk

## Report format

```markdown
## Supabase RLS Review

### İncelenen dosyalar
- ...

### Client kullanımı
| Dosya | Client tipi | Uygun mu? |
|-------|-------------|-----------|

### Policy eşlemesi
| Sorgu / akış | Policy | Server-side ek kontrol |
|--------------|--------|------------------------|

### Bulgular
- **Kritik:** ...
- **Orta:** ...
- **Düşük:** ...

### Service role
- Kullanıldı mı: Evet/Hayır
- `admin.ts` import: var/yok

### Öneri
- [ ] Güvenli devam
- [ ] Migration/policy gerekli — sprint dışı rapor
```

## Forbidden actions

- RLS/policy değişikliği yapma (inceleme only)
- Service role key okuma veya test etme
- `.env.local` erişimi
- Production veritabanına yazma
