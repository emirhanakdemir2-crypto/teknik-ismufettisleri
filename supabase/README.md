# Supabase — Müfettişe Sor

Bu klasör veritabanı migration dosyalarını içerir. Şemanın tek kaynağı `migrations/` altındaki numaralı SQL dosyalarıdır.

## Önkoşullar

- [Supabase CLI](https://supabase.com/docs/guides/cli) kurulu olmalı
- Supabase hesabında proje oluşturulmuş olmalı (bölge: `eu-central-1` / Frankfurt önerilir)

## Projeyi linkleme

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` değerini Supabase Dashboard → Project Settings → General bölümünden alın.

## Ortam değişkenleri

Proje kökündeki `.env.example` dosyasını `.env.local` olarak kopyalayın ve gerçek değerleri doldurun:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (yalnızca server-side)
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` (geliştirme)

Service role anahtarını asla client koduna veya tarayıcıya koymayın.

## Migration çalıştırma

Yerel geliştirme (Supabase local stack):

```bash
supabase start
supabase db reset
```

Uzak Supabase projesine uygulama:

```bash
supabase db push
```

Bu sprintte migration dosyası yalnızca repoda tutulur; push işlemini siz çalıştırmalısınız.

## TypeScript tipleri üretme

Migration uygulandıktan sonra:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

Üretilen dosyayı elle düzenlemeyin; şema değişince komutu tekrar çalıştırın.

## İlk şema özeti (`001_initial_schema.sql`)

| Tablo | Amaç |
|-------|------|
| `profiles` | Auth kullanıcı profili ve `user_role` |
| `categories` | Soru kategorileri |
| `questions` | Sorular (`question_status`, guest alanları) |
| `answers` | Müfettiş cevapları (`answer_status`) |
| `inspector_applications` | Müfettiş başvurusu ve belge yolu |
| `guest_question_tokens` | Misafir e-posta doğrulama tokenları |
| `moderation_logs` | Soru/cevap moderasyon kayıtları |
| `audit_logs` | Admin ve güvenlik audit kayıtları |
| `notifications` | Kullanıcı bildirimleri |

Enum tipleri: `user_role`, `question_status`, `answer_status`, `application_status`.

`question_status` değerleri: `published` (herkese açık, cevaplanabilir), `closed` (herkese açık, yeni cevap kabul etmez).

## Private storage (sonraki faz)

Migration bu sprintte storage bucket oluşturmaz. Sonraki adımlar:

1. Dashboard veya migration ile `inspector-documents` private bucket oluştur
2. Bucket policy: yalnızca admin service role erişimi
3. Public URL verme; imzalı URL yalnızca server-side admin modülünden
4. Her belge erişimini `audit_logs` tablosuna yaz

## Güvenlik notları

- Tüm public tablolarda RLS açıktır
- `profiles` tam tablo public değildir; kullanıcı kendi profilini, admin yönetim için tüm profilleri görür
- `profiles.role` değişikliği yalnızca service role ile yapılır (trigger + RLS); client'tan rol yükseltme engellenir
- Mesleki cevap yazma yalnızca `verified_inspector` rolündedir; admin cevap yazamaz, yalnızca cevap `status` moderasyonu yapar (body değiştiremez)
- `closed` sorular herkese görünür, ancak yeni müfettiş cevabı kabul etmez; yalnızca `published` sorulara cevap INSERT edilebilir
- `guest_question_tokens`, `audit_logs` yazımı ve guest soru akışı service role gerektirir
- `inspector_applications` SELECT client'ta yalnızca admin; başvuru oluşturma Server Action + service role ile yapılır
- `document_storage_path` client'tan güvenilerek alınmaz; yalnızca server-side oluşturulur; belge erişimi admin + audit log
- Müfettiş cevabında sahip yalnızca `body` güncelleyebilir (`protect_answers_owner_update` trigger)
- Soru sahibi yalnızca `category_id`, `title`, `body` ve gönderim status akışını güncelleyebilir (`protect_questions_owner_update` trigger)
