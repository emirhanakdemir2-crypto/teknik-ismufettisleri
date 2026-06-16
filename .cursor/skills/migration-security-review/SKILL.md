---
name: migration-security-review
description: Supabase migration veya SQL diff güvenlik incelemesi. supabase/migrations değiştiğinde, migration push öncesinde veya SQL güvenlik review istendiğinde kullan. Read-only; db push ve secret erişimi yok.
disable-model-invocation: true
paths: supabase/**/*.sql
---

# Migration Security Review

Read-only güvenlik incelemesi. Kod yazma, migration push ve secret erişimi bu skill kapsamında yoktur.

## Adımlar

1. Değişen veya incelenecek SQL dosyalarını tespit et (`supabase/migrations/`, `supabase/**/*.sql`).
2. `.cursor/rules/10-migration-safety.mdc` checklist maddelerini tek tek kontrol et.
3. RLS policy, trigger, helper function sırası, `SECURITY DEFINER` + `search_path`, GRANT/REVOKE bloklarını incele.
4. İş kurallarını doğrula:
   - `verified_inspector` dışında answer INSERT yok
   - Admin answer body değiştiremez; yalnızca status moderasyonu
   - `closed` soruya cevap INSERT yok
   - Service-role-only tablolar client'a kapalı
   - `profiles.role` client'tan değiştirilemez
5. Riskleri sınıflandır: **kritik** / **orta** / **düşük**.

## Yasaklar

- `supabase db push`, `supabase db reset` veya uzak DB komutu çalıştırma
- `.env.local` okuma veya kullanıcıdan secret/PAT/service role key isteme
- Migration dosyasını bu skill içinde otomatik düzenleme (inceleme raporu ver; düzeltme ayrı sprint)

## Çıktı Formatı

```markdown
## Migration Security Review

### İncelenen dosyalar
- ...

### Checklist sonucu
| Madde | Durum | Not |
|-------|-------|-----|

### Riskler
- **Kritik:** ...
- **Orta:** ...
- **Düşük:** ...

### Tavsiye
- [ ] Push edilebilir
- [ ] Push edilmemeli — önce düzelt: ...

### Migration sonrası (kullanıcı)
Push sonrası types: `npx supabase gen types typescript --linked`
```

Son satırda net tavsiye ver: **push edilebilir** veya **push edilmemeli**.
