# Manuel MVP Akış Testi

Dev veya Vercel preview/production ortamında soru moderasyonu ve müfettiş cevap akışını doğrulamak için kontrol listesi.

## Test hesapları

| Rol | Örnek e-posta | Bootstrap |
|-----|---------------|-----------|
| Yönetici (`admin`) | `emirhanakdemir9@gmail.com` | `003_bootstrap_founder_admin.sql` |
| Doğrulanmış müfettiş (`verified_inspector`) | `emirhanakdemir9+inspector@gmail.com` | `004_bootstrap_test_inspector.sql` |
| Vatandaş (`citizen`) | Örn. `test+citizen@example.com` | Varsayılan (`citizen`) |

> Bu e-postalar MVP/dev bootstrap içindir. Production öncesi kaldırılmalıdır.

## Rol → sayfa erişimi

| Rol | Erişebilir | Erişemez |
|-----|------------|----------|
| **Misafir** | `/`, `/questions`, `/questions/[id]`, `/login`, `/register` | `/ask`, `/account`, `/admin`, `/inspector` |
| **Citizen** | Yukarıdakiler + `/ask`, `/account` | `/admin`, `/inspector` |
| **Admin** | Yukarıdakiler + `/admin`, `/admin/questions` | `/inspector` (cevap yazamaz) |
| **Moderator** | Citizen + `/admin`, `/admin/questions` | `/inspector` |
| **Verified inspector** | Citizen + `/inspector`, `/inspector/questions`, `/inspector/questions/[id]` | `/admin` |

Panel linkleri `/account` sayfasında ve (admin/müfettiş için) üst menüde görünür.

## Ön koşullar

- [ ] Supabase migration’ları uygulanmış (`001`–`004`)
- [ ] Kategori seed mevcut (`002_seed_categories.sql`)
- [ ] `.env.local` (yerel) veya Vercel env (canlı) doğru yapılandırılmış
- [ ] Uygulama çalışıyor (`npm run dev` veya deploy URL)

---

## Akış 1 — Vatandaş soru gönderir

1. `/register` → citizen test e-postası ile kayıt (veya mevcut hesapla `/login`)
2. `/account` → **Beklenen:** Rol **Vatandaş**
3. `/ask` → kategori, başlık (≥10), metin (≥20) gir, gönder
4. **Beklenen:** Başarı mesajı; soru `pending_review`; `/questions` listesinde **görünmez**

---

## Akış 2 — Admin yayınlar

1. Çıkış → admin hesabıyla `/login` (`emirhanakdemir9@gmail.com`)
2. `/account` → **Beklenen:** Rol **Yönetici**; “Yönetim paneline git” linki var
3. `/admin` → bekleyen soru sayısı > 0 (soru gönderildiyse)
4. `/admin/questions` → citizen sorusu listede
5. **Yayınla** → **Beklenen:** Kuyruktan düşer; başarı mesajı
6. `/questions` → soru listede
7. `/questions/[id]` → detay açılır; henüz cevap olmayabilir

---

## Akış 3 — Müfettiş cevap yazar

1. Çıkış → müfettiş hesabıyla `/login` (`emirhanakdemir9+inspector@gmail.com`)
2. `/account` → **Beklenen:** Rol **Doğrulanmış müfettiş**; “Müfettiş paneline git” linki var
3. `/inspector` → yayındaki / cevap bekleyen sayıları görünür
4. `/inspector/questions` → yayımlanmış sorular; cevapsızlar önce
5. **Cevap yaz** → `/inspector/questions/[id]`
6. Cevap metni (≥20 karakter) → **Cevabı yayımla**
7. **Beklenen:** Başarı mesajı

---

## Akış 4 — Public cevap görünürlüğü

1. Çıkış yapmadan veya misafir olarak `/questions/[id]` aç
2. **Beklenen:**
   - Müfettiş cevabı görünür
   - **Doğrulanmış Müfettiş** etiketi görünür
   - Yasal bilgilendirme notu görünür

---

## Yetki kontrolleri (negatif test)

| Deneme | Beklenen |
|--------|----------|
| Citizen → `/admin` | “Bu alana erişim yetkiniz yok.” |
| Citizen → `/inspector` | “Bu alana erişim yetkiniz yok.” |
| Admin → `/inspector` | Erişim reddedildi |
| Misafir → `/ask` | `/login` yönlendirmesi |

---

## Hata olursa ne kontrol edilir?

| Sorun | Olası neden | Kontrol |
|-------|-------------|---------|
| Rol “Vatandaş” (admin olmalı) | Bootstrap migration uygulanmamış | `003` push; çıkış/giriş; `/account` |
| Rol “Vatandaş” (müfettiş olmalı) | `004` uygulanmamış | Aynı şekilde `004` |
| `/ask` kategori boş | Seed yok | `002_seed_categories.sql` |
| Admin kuyruk boş | Soru gönderilmemiş veya zaten yayınlanmış | Citizen ile `/ask` tekrar dene |
| Cevap yazılamıyor | Soru `published` değil | Admin yayınladı mı? |
| “Yetkiniz yok” (cevap) | Yanlış hesap veya RLS | Müfettiş hesabıyla giriş |
| Giriş redirect hatası | Auth URL uyumsuz | Supabase Site URL / Redirect URLs |
| Build/deploy hatası | Env eksik | Vercel env değişkenleri |

---

## Hızlı rota özeti

```
Citizen  → /register → /ask
Admin    → /admin/questions → Yayınla
Inspector → /inspector/questions/[id] → Cevap yaz
Herkes   → /questions/[id]
```

---

## Bilinen sınırlar (MVP)

- `moderation_logs` client üzerinden yazılmıyor
- Admin cevap düzenleme/gizleme paneli yok
- Misafir (guest) soru ve e-posta doğrulama yok
- Müfettiş başvuru/belge yükleme yok
- Founder/test inspector bootstrap production için geçici

## İlgili dokümanlar

- [Vercel deploy checklist](../deploy/vercel-deploy-checklist.md)
- [Kurucu admin bootstrap](../security/founder-admin-bootstrap.md)
