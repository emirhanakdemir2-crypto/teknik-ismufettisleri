# Manuel MVP Akış Testi

Bu kontrol listesi dev ortamında temel soru moderasyon akışını doğrulamak içindir.

## Ön koşullar

- Dev Supabase migration'ları uygulanmış olmalı (`001`, `002`, `003`).
- Kategori seed mevcut olmalı (`002_seed_categories.sql`).
- Uygulama `npm run dev` ile çalışıyor olmalı.

## 1. Kayıt ve admin rolü

1. `/register` sayfasına git.
2. `emirhanakdemir9@gmail.com` ile kayıt ol (hesap yoksa).
3. Giriş yap (`/login`).
4. `/account` sayfasını aç.
5. **Beklenen:** Rol alanı **Yönetici** görünür.

> Hesap daha önce oluşturulduysa `003_bootstrap_founder_admin.sql` migration'ı çalıştırıldıktan sonra aynı e-posta ile giriş yapıp `/account` üzerinden rolü doğrula.

## 2. Soru gönderme

1. `/ask` sayfasına git.
2. Kategori seç, başlık ve soru metni gir.
3. Formu gönder.
4. **Beklenen:** Başarı mesajı; soru `pending_review` durumunda oluşur.

## 3. Moderasyon kuyruğu

1. `/admin/questions` sayfasına git.
2. **Beklenen:** Az önce gönderilen soru listede görünür (başlık, kategori, yazar, tarih).

## 4. Yayınlama

1. Kuyruktaki soru için **Yayınla** butonuna tıkla.
2. **Beklenen:** Soru kuyruktan düşer; `/admin` özetinde bekleyen sayı azalır.

## 5. Public görünürlük

1. `/questions` sayfasını aç.
2. **Beklenen:** Yayımlanan soru listede görünür.
3. Soru başlığına tıkla → `/questions/[id]`.
4. **Beklenen:** Soru detayı açılır; başlık, gövde ve kategori doğru görünür.

## Hızlı rota özeti

```
/register → /login → /account (rol: Yönetici)
    → /ask (soru gönder)
    → /admin/questions (bekleyen soru)
    → Yayınla
    → /questions → /questions/[id]
```

## Bilinen sınırlar (MVP)

- `moderation_logs` henüz client üzerinden yazılmıyor.
- Müfettiş cevap yazma bu akışta yok.
- Misafir (guest) soru ve e-posta doğrulama bu akışta yok.
