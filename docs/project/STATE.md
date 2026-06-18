# Project State — Müfettişe Sor

> Yaşayan proje hafızası. Her sprint başında okunur; sprint sonunda güncellenir.
> Son güncelleme: Müfettiş başvuru akışı sprinti (commit eklenecek).

## Project snapshot

**Müfettişe Sor**, Teknik İşmüfettişleri Derneği için moderasyonlu İSG soru-cevap platformudur. Klasik tartışma forumu değildir: sorular moderasyon sonrası yayımlanır; mesleki cevaplar yalnızca doğrulanmış müfettişlerden gelir.

MVP canlıda; temel akışlar (kayıt, soru gönderme, moderasyon, müfettiş cevabı, public okuma, hesap paneli) çalışır durumda.

## Current live URL

- Production: `https://teknik-ismufettisleri.vercel.app`
- Hedef özel domain (planlı): `teknikismufettisleri.org.tr`

## Repository

- GitHub: `emirhanakdemir2-crypto/teknik-ismufettisleri`
- Ana branch: `main`
- Son bilinen commit (account dashboard): `88d1a4c` — Improve account dashboard

## Tech stack

| Katman | Teknoloji | Sürüm / not |
|--------|-----------|-------------|
| Framework | Next.js App Router | 16.2.9 |
| UI | React, Tailwind CSS | React 19.2.4, Tailwind 4 |
| Dil | TypeScript strict | 5.x |
| Backend | Supabase (PostgreSQL, Auth, RLS, Storage) | `@supabase/ssr` 0.12, `@supabase/supabase-js` 2.108 |
| Form | React Hook Form + Zod | MVP aktif |
| Deploy | Vercel | `main` push → otomatik deploy |
| Planlı (henüz tam entegre değil) | Upstash Redis, Resend, Sentry | Kurallarda tanımlı; MVP dışı veya kısmi |

## Supabase project

- Project ref: `gndcrtphbedurfykcgoq`
- Migrations (sırayla): `001_initial_schema`, `002_seed_categories`, `003_bootstrap_founder_admin`, `004_bootstrap_test_inspector`
- `src/lib/supabase/admin.ts` mevcut; **MVP kodunda import edilmiyor** (service role client hazır ama kullanılmıyor)

## Environment variables

Yalnızca isimler — değerler dokümana yazılmaz:

| Değişken | Kullanım |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server Supabase bağlantısı |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; tarayıcıya verilmez |
| `NEXT_PUBLIC_SITE_URL` | Auth redirect ve site origin (local / production) |

Şablon: `.env.example` — gerçek değerler `.env.local` (commit edilmez).

## Roles and permissions

Veritabanı rolleri (`profiles.role`):

| Rol | Özet yetki |
|-----|------------|
| `citizen` | Soru gönderir; kendi sorularını görür; mesleki cevap yazamaz |
| `inspector_pending` | Başvuru bekler; citizen ile benzer okuma/gönderme (cevap yok) |
| `verified_inspector` | Yayımlanmış sorulara cevap yazar |
| `moderator` | Soru moderasyonu (`/admin`, `/admin/questions`); cevap yazamaz |
| `admin` | Moderasyon + ileride yönetim; **admin mesleki cevap yazamaz** (rol fonksiyonu) |

`guest` veritabanı rolü değildir; oturumsuz ziyaretçidir.

Test/bootstrap hesapları (MVP geçici):

| Rol | E-posta | Migration |
|-----|---------|-----------|
| `admin` | `emirhanakdemir9@gmail.com` | `003`, `004` |
| `verified_inspector` | `emirhanakdemir9+inspector@gmail.com` | `004` |
| `citizen` | Diğer kayıtlı e-postalar | Varsayılan `citizen` |

Yetki kaynağı: Supabase RLS + `src/lib/auth/roles.ts` + server action/route kontrolleri. `proxy.ts` yalnızca oturum yenileme ve hafif route guard.

## Public flows

| Rota | Kim | Davranış |
|------|-----|----------|
| `/` | Herkes | Ana sayfa; gerçek kategoriler ve yayımlanmış soru özetleri |
| `/questions` | Herkes | Yayımlanmış soru listesi + arama |
| `/questions/[id]` | Herkes | Yalnızca `published` / `closed` soru detayı; yalnızca `published` cevaplar |
| `/categories` | Herkes | Aktif kategoriler; yayındaki soru sayısı ve son yayın tarihi (gerçek veri) |
| `/categories/[slug]` | Herkes | Kategoriye ait yayımlanmış sorular; geçersiz slug → 404 |
| `/login`, `/register`, `/register/inspector` | Herkes | Auth formları; müfettiş başvuru kaydı ayrı akış |

Public görünürlük: `questions_select_published` (status `published` / `closed`); cevaplar `status = published`.

## Auth flows

| Rota | Kim | Davranış |
|------|-----|----------|
| `/register` | Misafir | Kayıt → varsayılan `citizen` (founder e-postası hariç bootstrap) |
| `/register/inspector` | Misafir | Müfettiş başvurusu ile kayıt; başvuru bilgisi auth `user_metadata` |
| `/inspector/apply` | Oturumlu | Başvuru tamamlama / durum; guest → login yönlendirmesi |
| `/login` | Misafir | Oturum açma (`next` param destekli) |
| `/account` | Oturumlu | Hesap özeti, soru durumları, benim sorularım, hızlı erişim |
| `/ask` | Oturumlu | Soru gönderme → `pending_review`; `/login` yönlendirmesi misafir için |

**Henüz yok (planlı):** misafir (guest) e-posta doğrulamalı soru akışı; `/ask` şu an login gerektirir.

## Admin flows

| Rota | Kim | Davranış |
|------|-----|----------|
| `/admin` | `admin`, `moderator` | Moderasyon özeti (istatistik kartları) |
| `/admin/questions` | `admin`, `moderator` | `pending_review` kuyruğu; yayınla / reddet |

Server actions: `src/app/admin/actions.ts` — `requireModeratorAccess()` ile korunur.

## Inspector flows

| Rota | Kim | Davranış |
|------|-----|----------|
| `/inspector` | `verified_inspector` | Müfettiş panel özeti (`inspector/(panel)/`) |
| `/inspector/questions` | `verified_inspector` | Yayımlanmış sorular; cevap bekleyenler |
| `/inspector/questions/[id]` | `verified_inspector` | Cevap yazma formu |
| `/inspector/apply` | Oturumlu citizen+ | Başvuru formu veya incelemede durumu |

Server actions: `src/app/inspector/actions.ts` — `requireInspectorAccess()` ile korunur.

**Müfettiş başvuru (bu sprint):** UI akışı `/register/inspector` + `/inspector/apply`. Başvuru verisi geçici olarak Supabase Auth `user_metadata` içinde tutulur. `inspector_applications` tablosuna INSERT ve `profiles.role → inspector_pending` güncellemesi **henüz yok** (RLS + trigger + zorunlu `document_storage_path`).

**Sonraki sprint:** Admin müfettiş başvuru yönetimi, `inspector_applications` kaydı (service role), belge yükleme, rol onayı.

## Completed phases

| Faz / sprint | Commit (örnek) | Çıktı |
|--------------|----------------|-------|
| Şema + RLS | `001` migration | Tablolar, roller, policies |
| Kategori seed | `002` | Aktif kategoriler |
| Founder admin bootstrap | `003` | Kurucu admin rolü |
| Inspector + cevap akışı | `004`, `ecb6fc3` | Müfettiş paneli, cevap workflow |
| MVP deploy hazırlığı | `279be11` | README, Vercel checklist |
| Public UI polish | `713b8bc`, `c15bf6b` | Modern forum portal, mock kaldırma |
| Kategori düzeltmesi | `fbf566f` | `noStore` + dinamik ana sayfa |
| Account dashboard | `88d1a4c` | `/account` zenginleştirme |
| Compound project memory | `e2dd57a` | `docs/project/*`, `.cursor/skills/*`, AGENTS/rules entegrasyonu |
| Commit attribution rules | `11c0761` | AGENTS/rules/sprint-closeout — bot co-author yasağı |
| Forum experience polish | `e4fa574` | `/categories`, `/categories/[slug]`, soru listesi/detay iyileştirmesi |
| Inspector registration flow | (bu commit) | `/register/inspector`, `/inspector/apply`, rol label polish |

## Current production status

- Vercel production deploy aktif (`main` push ile otomatik).
- Auth çalışıyor (Supabase Auth + SSR cookies).
- Temel MVP akışı canlıda test edilebilir.
- Bootstrap admin/müfettiş hesapları production'da geçici; kaldırılması planlı.

## Known working flows

1. Citizen kayıt/giriş → `/account` rol görünümü
2. Citizen `/ask` → soru `pending_review` → public listede **görünmez**
3. Admin `/admin/questions` → yayınla → `/questions` ve `/questions/[id]` görünür
4. Müfettiş `/inspector/questions/[id]` → cevap → public detayda görünür
5. `/account` → kullanıcı kendi sorularını ve durum sayaçlarını görür (RLS `questions_select_own`)
6. Yetkisiz erişim → Türkçe red mesajı veya login yönlendirmesi
7. `/categories` ve `/categories/[slug]` → gerçek kategori/soru verisi; pending sızıntısı yok

## Known risks

| Risk | Durum | Not |
|------|-------|-----|
| Bootstrap e-posta ile rol atama | Aktif (MVP) | Production öncesi kaldırılmalı |
| `moderation_logs` client INSERT yok | Bilinçli MVP sınırı | Service role + audit ileride |
| Guest soru akışı yok | Eksik özellik | Ürün tanımında planlı |
| Rate limit / Resend | Planlı, tam entegre değil | Kurallarda tanımlı |
| `moderation-queue-mock.tsx` | Dosya var, import edilmiyor | Ölü mock; public'te kullanılmıyor |
| Service role client | Tanımlı, kullanılmıyor | Yanlışlıkla client import riskine dikkat |
| Müfettiş başvuru DB kaydı | Metadata-only (MVP) | `inspector_applications` INSERT yalnızca service role; migration sonraki sprint |

## Pending decisions

- Özel domain (`teknikismufettisleri.org.tr`) bağlama zamanı
- Bootstrap migration'ların production'dan kaldırılması ve admin davet akışı
- Guest (e-posta doğrulamalı) soru sprinti önceliği
- Müfettiş başvuru admin onayı + belge yükleme (DB + service role)
- Rate limit (Upstash) ve e-posta (Resend) entegrasyon sırası
- AI moderasyon (Faz 2+) kapsamı ve eşikler

## Next recommended sprint

1. **Müfettiş başvuru yönetimi (admin)** — `inspector_applications` INSERT, belge storage, `inspector_pending` / `verified_inspector` rol onayı
2. **Guest soru akışı** — e-posta doğrulama + rate limit (migration gerekebilir; açık rapor)
3. **Moderasyon audit trail** — `moderation_logs` server-side yazımı
4. **Production hardening** — bootstrap kaldırma, özel domain, smoke test matrisi canlı çalıştırma

## Lessons learned

- Ana sayfa kategorileri için `cache: "no-store"` + `noStore()` + `dynamic = "force-dynamic"` gerekli oldu (`fbf566f`).
- Account sayfası mevcut RLS (`questions_select_own`) ile migration gerektirmeden kendi sorularını listeleyebildi.
- UI polish sprintlerinde fake stats ve mock veri kaldırıldı; gerçek DB sorguları kullanılmalı.
- `proxy.ts` yetkilendirme değildir; her mutasyonda server-side rol kontrolü şart.
- Proje hafızası `docs/project/` ve agent skill'leri `.cursor/skills/` ile sprint disiplini kodlandı
- Müfettiş başvurusu migration olmadan yalnızca `user_metadata` ile tutulabilir; DB rol değişimi `protect_profiles_role` nedeniyle service role gerektirir

## Do not do list

- Service role veya `src/lib/supabase/admin.ts` client tarafında kullanma
- `.env.local` okuma, yazma veya commit
- Secret / API key / token değerlerini dokümana veya rapora yazma
- `git push --force`
- Migration veya RLS değişikliğini sessizce yapma — açık onay ve rapor gerekir
- Tablo, kolon, rol veya env variable uydurma
- Kimlik belgelerini AI sağlayıcısına gönderme veya public URL verme
- Public sayfalarda fake istatistik, demo admin mock veya sahte soru listesi
- Kurallar ile çelişen büyük tek commit'ler
