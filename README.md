# Müfettişe Sor

Teknik İşmüfettişleri Derneği için **moderasyonlu soru-cevap** platformu. İş sağlığı, güvenliği ve çalışma hayatına dair sorular sorulur; yanıtlar yalnızca doğrulanmış müfettişlerden gelir.

## Ne yapar?

- Herkes yayımlanmış soru ve cevapları okuyabilir.
- Kayıtlı vatandaşlar soru gönderebilir (moderasyon sonrası yayımlanır).
- Admin ve moderatör soruları onaylar veya reddeder.
- Doğrulanmış müfettişler yayımlanmış sorulara cevap yazar.
- Admin mesleki cevap yazamaz; cevap moderasyonu ayrı bir akıştır.

## Roller

| Rol | Açıklama |
|-----|----------|
| `citizen` | Soru sorar, yayımlanmış içeriği okur |
| `moderator` | Soru moderasyonu (`/admin`) |
| `admin` | Soru moderasyonu + ileride yönetim işlemleri |
| `verified_inspector` | Yayımlanmış sorulara cevap yazar (`/inspector`) |

MVP’de dev bootstrap ile iki test hesabı tanımlıdır; ayrıntı için `docs/reference/security/founder-admin-bootstrap.md` ve `docs/reference/testing/manual-mvp-flow.md` dosyalarına bakın.

## Ana akış

```
Vatandaş → Soru sor (/ask)
Admin/Moderatör → Yayınla veya reddet (/admin/questions)
Müfettiş → Cevap yaz (/inspector/questions)
Herkes → Oku (/questions, /questions/[id])
```

## Yerel çalıştırma

```bash
npm install
```

`.env.local` dosyasını proje kökünde oluşturun (`.env.example` şablonuna bakın):

```bash
cp .env.example .env.local
```

Gerekli değişkenleri Supabase projenizden doldurun, ardından:

```bash
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde açılır.

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Deploy

Vercel’e deploy öncesi adım adım kontrol listesi:

**[docs/reference/deploy/vercel-deploy-checklist.md](docs/reference/deploy/vercel-deploy-checklist.md)**

Özet:

- Vercel ortam değişkenleri tanımlanmalı (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`).
- Canlı domain belirlendikten sonra Supabase Auth **Site URL** ve **Redirect URLs** güncellenmelidir.
- Deploy sonrası `docs/reference/testing/manual-mvp-flow.md` akışı ile test edin.

## Güvenlik

- **`.env.local` commitlenmez** — gizli anahtarlar yalnızca sunucu/CI ortamında tutulur.
- **`SUPABASE_SERVICE_ROLE_KEY` tarayıcıya verilmez** — yalnızca server-only kullanım içindir (MVP’de henüz sınırlı kullanım).
- Rol ataması client tarafından yapılamaz; RLS ve server-side kontroller geçerlidir.

## Referanslar

- Mimari ve güvenlik: `.cursor/rules/`
- Ürün tanımı: `docs/reference/product/`
- Manuel test: `docs/reference/testing/manual-mvp-flow.md`
- Deploy: `docs/reference/deploy/vercel-deploy-checklist.md`

## Teknoloji

Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, RLS), Vercel.
