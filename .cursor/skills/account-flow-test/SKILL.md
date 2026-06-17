---
name: account-flow-test
description: Müfettişe Sor /account hesap akışı manuel testi. Account dashboard değişikliği veya RLS own-question doğrulamasında kullan.
disable-model-invocation: false
---

# Account Flow Test — Müfettişe Sor

## Purpose

`/account` sayfası ve “benim sorularım” akışını rol bazlı doğrulamak; kullanıcının yalnızca kendi sorularını gördüğünü ve hızlı erişim kartlarının doğru olduğunu test etmek.

## When to use

- Account dashboard veya `src/lib/account/` değişikliği sonrası
- `questions_select_own` RLS şüphesi
- Sprint closeout öncesi account özelliği doğrulaması

## Required context files

- `docs/project/TEST_MATRIX.md` (Citizen bölümü)
- `docs/project/STATE.md`
- `src/app/account/page.tsx`
- `src/lib/account/queries.ts`
- `supabase/migrations/001_initial_schema.sql` (`questions_select_own`)

## Steps

### Ön koşul

- Uygulama çalışıyor (local veya `https://teknik-ismufettisleri.vercel.app`)
- En az iki farklı citizen hesabı veya bir citizen + admin test verisi

### Citizen testleri

1. **Giriş koruması** — oturumsuz `/account` → `/login`
2. **Hesap özeti** — görünen ad, e-posta, rol etiketi, hesap tipi açıklaması, üyelik tarihi görünür
3. **Soru gönder** — `/ask` ile soru oluştur (`pending_review`)
4. **Benim sorularım** — `/account#benim-sorularim`:
   - Yeni soru listede
   - Durum rozeti “İncelemede”
   - Başlık **link değil** (pending)
5. **Durum sayaçları** — İncelemede ≥1, Toplam artmış; sahte sayı yok
6. **Hızlı erişim** — Soru Sor, Yayınlanan Sorular, Benim Sorularım kartları var
7. Admin yayınladıktan sonra — aynı soru satırında `/questions/[id]` linki çalışır; Yayında sayacı artar

### Rol bazlı hızlı erişim

| Rol | Beklenen ek kartlar |
|-----|---------------------|
| Citizen | Yalnızca genel üç kart |
| Admin | + Yönetim Paneli, Moderasyon Kuyruğu |
| Verified Inspector | + Müfettiş Paneli, Cevap Bekleyen Sorular |

### Güvenlik (negatif)

1. Citizen A ile giriş → kendi soruları görünür
2. Citizen B'nin `pending_review` / `rejected` sorusu Citizen A'nın `/account` listesinde **yok**
3. Pending soru UUID ile `/questions/[id]` → public detay **açılmaz**
4. Reddedilen soruda `moderation_note` yalnızca soru sahibinde kısa görünür

### Boş durum

- Hiç sorusu olmayan citizen → “Henüz soru göndermediniz” + Soru Sor CTA

## Verification

- [ ] Özet alanları dolu ve doğru rol
- [ ] Kendi soruları listeleniyor
- [ ] Başkasının non-public sorusu görünmüyor
- [ ] Pending'e public link yok
- [ ] Sayaçlar gerçek veriden
- [ ] Rol bazlı kartlar doğru

## Stop conditions

- Başkasının pending sorusu görünüyorsa → **kritik**; RLS review gerekir, commit/push durdur
- Sayaçlar sabit/fake → UI bug raporu

## Report format

```markdown
## Account Flow Test

### Ortam
- URL: local / production
- Test hesapları: (e-posta, rol — secret yok)

### Sonuçlar
| Test | Sonuç | Not |
|------|-------|-----|

### Güvenlik
- Başka kullanıcı sorusu sızıntısı: Yok / VAR

### Öneri
- [ ] Account akışı onaylı
- [ ] Düzeltme gerekli: ...
```

## Forbidden actions

- Service role ile başka kullanıcı verisi çekme testi (anon session yeterli)
- `.env.local` okuma
- Secret rapora yazma
