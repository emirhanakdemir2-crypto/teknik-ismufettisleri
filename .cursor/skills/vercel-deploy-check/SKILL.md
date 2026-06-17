---
name: vercel-deploy-check
description: Müfettişe Sor Vercel deploy ve canlı smoke test kontrolü. Deploy öncesi/sonrası, env ve Auth redirect doğrulamasında kullan.
disable-model-invocation: false
---

# Vercel Deploy Check — Müfettişe Sor

## Purpose

Vercel deploy öncesi ve sonrası zorunlu kontrolleri çalıştırmak: env isimleri, build/lint, Supabase Auth redirect uyumu ve canlı smoke test.

## When to use

- `main` push sonrası deploy doğrulaması
- Yeni env değişkeni eklendiğinde
- Auth redirect hatası şüphesi
- Özel domain bağlama öncesi/sonrası

## Required context files

- `docs/reference/deploy/vercel-deploy-checklist.md`
- `docs/project/STATE.md`
- `docs/project/TEST_MATRIX.md` (smoke test bölümü)
- `.env.example` (yalnızca isimler)

## Steps

### Ön deploy (yerel)

1. `git status --short` — beklenmeyen dosya yok
2. `git ls-files .env.local` — boş (tracked değil)
3. `npm run lint` — başarılı
4. `npm run build` — başarılı
5. Migration'lar hedef Supabase'de uygulanmış mı (`001`–`004`) — kullanıcıya sor/raporla

### Vercel env (yalnızca isimler — değer yazma)

| Değişken | Ortam |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Production = canlı URL; Preview = preview URL |

Canlı URL: `https://teknik-ismufettisleri.vercel.app`

### Supabase Auth redirect

Supabase Dashboard → Authentication → URL Configuration:

- **Site URL** = `NEXT_PUBLIC_SITE_URL` ile aynı origin
- **Redirect URLs** içinde:
  - `http://localhost:3000/**`
  - `https://teknik-ismufettisleri.vercel.app/**`
  - Özel domain varsa `https://teknikismufettisleri.org.tr/**`

### Deploy sonrası smoke test

Canlı URL'de sırayla (`docs/project/TEST_MATRIX.md` smoke):

| # | Rota | Beklenen |
|---|------|----------|
| 1 | `/` | Sayfa açılır; kategoriler yüklenir |
| 2 | `/questions` | Yayımlanmış liste |
| 3 | `/login` | Form açılır |
| 4 | `/account` (oturumlu) | Hesap paneli |
| 5 | `/ask` (citizen) | Soru formu |
| 6 | `/admin/questions` (admin) | Moderasyon kuyruğu |
| 7 | `/inspector/questions` (müfettiş) | Cevap listesi |

Test hesapları (e-posta — secret değil):
- Admin: `emirhanakdemir9@gmail.com`
- Müfettiş: `emirhanakdemir9+inspector@gmail.com`

## Verification

- [ ] Lint ve build yerelde başarılı
- [ ] `.env.local` tracked değil
- [ ] Dört env ismi Vercel'de tanımlı (değerler rapora yazılmaz)
- [ ] Supabase Site URL / Redirect uyumlu
- [ ] Smoke test en az guest + login rotaları geçti

## Stop conditions

- Build başarısız → deploy önerme
- Auth redirect uyumsuz → login sonrası hata; düzeltmeden “canlı OK” deme
- Secret değer rapora yazılmış → düzelt

## Report format

```markdown
## Vercel Deploy Check

### Yerel kontroller
| Kontrol | Sonuç |
|---------|-------|

### Env isimleri (değer yok)
- NEXT_PUBLIC_SUPABASE_URL: tanımlı / eksik
- NEXT_PUBLIC_SUPABASE_ANON_KEY: ...
- SUPABASE_SERVICE_ROLE_KEY: ...
- NEXT_PUBLIC_SITE_URL: ...

### Supabase Auth
- Site URL uyumu: ...
- Redirect URLs: ...

### Smoke test (canlı)
| Rota | Sonuç |
|------|-------|

### Öneri
- [ ] Deploy / canlı onaylı
- [ ] Düzeltme gerekli: ...
```

## Forbidden actions

- Env **değerlerini** rapora veya dokümana yazma
- `.env.local` okuma
- `git push --force`
- Elle Vercel deploy tetikleme talimatı yerine kullanıcıya push sonrası otomatik deploy notu
