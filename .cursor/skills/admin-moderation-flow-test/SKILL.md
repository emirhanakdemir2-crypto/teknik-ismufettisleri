---
name: admin-moderation-flow-test
description: Müfettişe Sor admin moderasyon akışı testi. Pending soru, publish, reject, public görünürlük ve yetki sınırlarını doğrular.
disable-model-invocation: false
---

# Admin Moderation Flow Test — Müfettişe Sor

## Purpose

Soru moderasyon döngüsünü uçtan uca test etmek: citizen gönderir → admin/moderator kuyrukta görür → yayınla/reddet → public görünürlük ve güvenlik sınırları.

## When to use

- `src/app/admin/` veya `src/lib/admin/` değişikliği sonrası
- Moderasyon server action değişikliğinde
- Publish/reject sonrası public sızıntı şüphesi
- Sprint closeout öncesi core MVP akış doğrulaması

## Required context files

- `docs/project/TEST_MATRIX.md` (Admin, Guest, Citizen bölümleri)
- `docs/reference/testing/manual-mvp-flow.md`
- `src/app/admin/actions.ts`
- `src/lib/auth/require-moderator.ts`
- `supabase/migrations/001_initial_schema.sql`

## Steps

### Ön koşul

- Migration `001`–`004` uygulanmış
- Admin test hesabı: `emirhanakdemir9@gmail.com`
- Citizen test hesabı (ayrı e-posta)

### Akış 1 — Citizen soru gönderir

1. Citizen `/ask` → soru gönder
2. `/questions` → soru **görünmez**
3. `/account` → citizen kendi sorusunu görür (`pending_review`)

### Akış 2 — Admin moderasyon

1. Admin `/login`
2. `/admin` → istatistik kartları (pending sayısı tutarlı)
3. `/admin/questions` → citizen sorusu kuyrukta
4. **Yayınla** → başarı mesajı; kuyruktan düşer
5. `/questions` → soru listede
6. `/questions/[id]` → detay açılır

### Akış 3 — Reddet (ayrı test sorusu)

1. Yeni citizen sorusu
2. Admin **Reddet** (+ isteğe bağlı moderasyon notu)
3. `/questions` → görünmez
4. Citizen `/account` → `rejected` rozeti; not kısa görünür (varsa)
5. Guest `/questions/[uuid]` → erişim yok

### Yetki (negatif)

| Deneme | Beklenen |
|--------|----------|
| Citizen → `/admin` | Erişim reddedildi |
| Citizen → `/admin/questions` | Erişim reddedildi |
| Guest → `/admin/questions` | Login / red |
| Admin → `/inspector` | Erişim reddedildi (cevap yazamaz) |

### Public cevap görünürlüğü (moderasyon sonrası)

1. Müfettiş cevap yazar (`emirhanakdemir9+inspector@gmail.com`)
2. Guest `/questions/[id]` → yalnızca `published` cevaplar görünür

## Verification

- [ ] Pending public listede yok
- [ ] Admin kuyrukta pending görüyor
- [ ] Publish sonrası public listede var
- [ ] Reject sonrası public'te yok; sahip account'ta görünür
- [ ] Citizen admin paneline giremiyor
- [ ] Admin müfettiş paneline giremiyor

## Stop conditions

- Pending soru `/questions` public listesinde → **kritik** RLS/UI bug
- Citizen admin kuyruğunu görebiliyor → **kritik**
- Yayınlanmamış soru public detay açılıyor → **kritik**

## Report format

```markdown
## Admin Moderation Flow Test

### Ortam
- URL: ...
- Admin: emirhanakdemir9@gmail.com
- Citizen: [test e-posta]

### Akış sonuçları
| Adım | Sonuç | Not |
|------|-------|-----|

### Güvenlik
| Negatif test | Sonuç |
|--------------|-------|

### Öneri
- [ ] Moderasyon akışı onaylı
- [ ] Düzeltme gerekli: ...
```

## Forbidden actions

- Production'da toplu test verisi silme (kullanıcı onayı olmadan)
- Service role ile moderasyon (normal admin session ile test et)
- Secret veya `.env.local` erişimi
