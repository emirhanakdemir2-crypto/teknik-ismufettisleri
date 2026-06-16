# Vercel Deploy Kontrol Listesi

Müfettişe Sor MVP’sini Vercel’e almadan önce bu listeyi sırayla uygulayın.

## 1. GitHub hazırlığı

- [ ] Kod `main` branch’inde ve remote’a push edilmiş
- [ ] `.env.local` tracked değil (`git ls-files .env.local` boş olmalı)
- [ ] `npm run lint` ve `npm run build` yerelde başarılı
- [ ] Supabase migration’ları hedef projede uygulanmış (`001`–`004`)

## 2. Vercel import

1. [vercel.com](https://vercel.com) → **Add New Project**
2. GitHub reposunu seçin: `teknik-ismufettisleri`
3. Framework: **Next.js** (otomatik algılanır)
4. Root Directory: `.` (varsayılan)
5. Build Command: `npm run build` (varsayılan)
6. Output: Next.js varsayılanı

## 3. Ortam değişkenleri

Vercel → Project → **Settings** → **Environment Variables**

| Değişken | Ortam | Not |
|----------|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Supabase proje URL’si |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | **Server-only** — tarayıcıya expose edilmez |
| `NEXT_PUBLIC_SITE_URL` | Production | Canlı site URL’si (ör. `https://teknikismufettisleri.org.tr`) |
| `NEXT_PUBLIC_SITE_URL` | Preview | Preview URL veya staging domain |

Değerleri Supabase Dashboard → **Project Settings** → **API** bölümünden alın.

> MVP’de uygulama kodu service role’u sınırlı kullanır; yine de Vercel’de tanımlı olmalıdır (ileride moderation/audit log için).

## 4. Supabase Auth URL ayarları

Supabase Dashboard → **Authentication** → **URL Configuration**

### Site URL

- Production: canlı domain (ör. `https://your-domain.vercel.app` veya özel domain)
- Geliştirme: `http://localhost:3000`

### Redirect URLs

Aşağıdakileri ekleyin (domain’e göre uyarlayın):

```
http://localhost:3000/**
https://your-project.vercel.app/**
https://your-custom-domain.org.tr/**
```

Deploy sonrası `NEXT_PUBLIC_SITE_URL` ile Supabase Site URL aynı origin’i göstermelidir.

## 5. Deploy

1. Vercel’de **Deploy** tetikleyin (ilk import veya `main` push)
2. Build log’unda hata olmadığını doğrulayın
3. Production URL’yi not edin

## 6. Deploy sonrası test

`docs/reference/testing/manual-mvp-flow.md` akışını canlı ortamda çalıştırın:

| Adım | Rota | Beklenen |
|------|------|----------|
| Kayıt | `/register` | Hesap oluşur |
| Giriş | `/login` | Oturum açılır |
| Hesap | `/account` | Rol doğru görünür |
| Soru | `/ask` | `pending_review` oluşur |
| Moderasyon | `/admin/questions` | Admin yayınlar |
| Müfettiş | `/inspector/questions` | Cevap yazılır |
| Public | `/questions`, `/questions/[id]` | Soru ve cevap görünür |

### Test hesapları (MVP dev bootstrap)

| Rol | E-posta |
|-----|---------|
| Admin | `emirhanakdemir9@gmail.com` |
| Müfettiş | `emirhanakdemir9+inspector@gmail.com` |
| Vatandaş | Başka herhangi bir e-posta |

## 7. Özel domain bağlama

1. Vercel → **Settings** → **Domains**
2. DNS kayıtlarını Vercel yönergelerine göre ekleyin
3. Domain aktif olduktan sonra:
   - `NEXT_PUBLIC_SITE_URL` güncelle
   - Supabase Auth Site URL ve Redirect URLs güncelle
   - Yeniden deploy (env değişikliği için)

## 8. Production öncesi kaldırılacak / iyileştirilecekler

| Konu | Durum (MVP) | Hedef |
|------|-------------|-------|
| Founder admin bootstrap | `003_bootstrap_founder_admin.sql` | Admin davet / role management |
| Test inspector bootstrap | `004_bootstrap_test_inspector.sql` | Müfettiş başvuru ve admin onayı |
| Moderation logs | Client INSERT yok | Service role + audit trail |
| Audit logs | Kısıtlı | Admin işlem kayıtları |
| Guest soru | Yok | E-posta doğrulamalı misafir akışı |
| Rate limit / e-posta | Kısmi / yok | Upstash + Resend entegrasyonu |

## Sorun giderme

| Belirti | Kontrol |
|---------|---------|
| Giriş sonrası redirect hatası | Supabase Redirect URLs ve `NEXT_PUBLIC_SITE_URL` |
| “Invalid API key” | Vercel env değişkenleri ve redeploy |
| Admin paneli erişim reddi | `/account` rolü; migration `003`/`004` uygulandı mı? |
| Soru listesi boş | Admin moderasyonu; kategori seed (`002`) |
| Build başarısız | `npm run build` yerelde; Vercel Node sürümü |

## İlgili dokümanlar

- [Manuel MVP test akışı](../testing/manual-mvp-flow.md)
- [Kurucu admin bootstrap](../security/founder-admin-bootstrap.md)
- [Proje README](../../README.md)
