# Manuel MVP Akış Testi

Bu kontrol listesi dev ortamında soru moderasyonu ve müfettiş cevap akışını doğrulamak içindir.

## Test hesapları

| Rol | E-posta |
|-----|---------|
| Yönetici (admin) | `emirhanakdemir9@gmail.com` |
| Doğrulanmış müfettiş | `emirhanakdemir9+inspector@gmail.com` |
| Vatandaş (citizen) | Herhangi bir diğer e-posta |

## Ön koşullar

- Dev Supabase migration'ları uygulanmış olmalı (`001`–`004`).
- Kategori seed mevcut olmalı (`002_seed_categories.sql`).
- Uygulama `npm run dev` ile çalışıyor olmalı.

## Akış A — Admin moderasyon

### 1. Admin kayıt ve rol

1. `/register` → `emirhanakdemir9@gmail.com` (hesap yoksa).
2. `/login` → giriş yap.
3. `/account` → **Beklenen:** Rol **Yönetici**.

### 2. Soru gönderme (vatandaş veya admin)

1. Farklı bir citizen hesabıyla veya admin hesabıyla `/ask` sayfasına git.
2. Kategori seç, başlık ve soru metni gir, gönder.
3. **Beklenen:** Soru `pending_review` durumunda oluşur.

### 3. Moderasyon ve yayın

1. Admin hesabıyla `/admin/questions` sayfasına git.
2. Bekleyen soruyu gör, **Yayınla** butonuna tıkla.
3. **Beklenen:** Soru kuyruktan düşer.

### 4. Public görünürlük

1. `/questions` → yayımlanan soru listede görünür.
2. `/questions/[id]` → soru detayı açılır.

## Akış B — Müfettiş cevap

### 5. Test müfettiş kayıt ve rol

1. `/register` → `emirhanakdemir9+inspector@gmail.com` (hesap yoksa).
2. `/login` → giriş yap.
3. `/account` → **Beklenen:** Rol **Doğrulanmış müfettiş**.

> Hesap daha önce oluşturulduysa `004_bootstrap_test_inspector.sql` migration'ı sonrası aynı e-posta ile giriş yapıp rolü doğrula.

### 6. Müfettiş paneli

1. `/inspector` → özet sayfası açılır (yayındaki soru, cevap bekleyen, kendi cevap sayısı).
2. `/inspector/questions` → yayımlanmış sorular listelenir; cevapsız sorular önce gelir.

### 7. Cevap yazma

1. Bir soru için **Cevap yaz** → `/inspector/questions/[id]`.
2. En az 20 karakterlik cevap metni gir, **Cevabı yayımla**.
3. **Beklenen:** Başarı mesajı; cevap `published` olarak kaydedilir.

### 8. Public cevap görünürlüğü

1. `/questions/[id]` → müfettiş cevabı görünür.
2. **Beklenen:** Cevap veren `display_name` (varsa) ve **Doğrulanmış Müfettiş** etiketi görünür.

## Hızlı rota özeti

```
Citizen → /ask (soru gönder)
Admin → /admin/questions → Yayınla
Inspector → /inspector/questions → Cevap yaz
Herkes → /questions/[id] (cevap görünür)
```

## Yetki kontrolleri (manuel)

- Admin hesabı `/inspector` erişemez (erişim reddedildi).
- Citizen hesabı `/inspector` erişemez.
- Admin hesabı cevap yazamaz (panel yok; doğrudan insert de RLS ile engellenir).

## Bilinen sınırlar (MVP)

- `moderation_logs` henüz client üzerinden yazılmıyor.
- Admin cevap düzenleme/gizleme paneli yok.
- Misafir (guest) soru ve e-posta doğrulama yok.
- Müfettiş başvuru/belge yükleme yok.
