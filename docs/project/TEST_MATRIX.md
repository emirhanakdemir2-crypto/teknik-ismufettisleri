# Test Matrix — Müfettişe Sor

> Kalıcı manuel test matrisi. Güvenlik ve rol sınırları önceliklidir.
> Canlı test URL: `https://teknik-ismufettisleri.vercel.app`

## Roller

| Rol | Oturum | Test hesabı örneği |
|-----|--------|-------------------|
| Guest | Yok | — |
| Citizen | Var | Yeni kayıt veya `test+citizen@example.com` benzeri |
| Admin | Var | `emirhanakdemir9@gmail.com` |
| Moderator | Var | Henüz bootstrap yok; manuel rol ataması veya ileride |
| Verified Inspector | Var | `emirhanakdemir9+inspector@gmail.com` |
| Inspector Pending | Var | Henüz başvuru UI yok; manuel DB rolü veya ileride |

---

## Guest (misafir)

| Test adı | Rol | URL | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|-----|----------------|----------------------|
| Public soru listesi | Guest | `/questions` | Yalnızca `published` sorular listelenir | `pending_review` / `rejected` görünmez |
| Public soru detayı | Guest | `/questions/[id]` (yayımlanmış) | Soru metni ve `published` cevaplar görünür | Gizli/hidden cevap görünmez |
| Pending soru detayı erişimi | Guest | `/questions/[uuid-pending]` | 404 veya “bulunamadı”; içerik sızmaz | RLS `questions_select_published` |
| Rejected soru detayı erişimi | Guest | `/questions/[uuid-rejected]` | Erişim yok | Başkasının moderasyon durumu sızmaz |
| Ana sayfa | Guest | `/` | Kategoriler ve yayımlanmış özetler; fake stat yok | Mock veri kullanılmamalı |
| Ask koruması | Guest | `/ask` | `/login` yönlendirmesi | Oturumsuz soru gönderilemez (MVP) |
| Account koruması | Guest | `/account` | `/login` yönlendirmesi | — |
| Admin koruması | Guest | `/admin` | Login yönlendirmesi veya erişim reddi | — |
| Inspector koruması | Guest | `/inspector` | Login yönlendirmesi veya erişim reddi | — |

---

## Citizen (vatandaş)

| Test adı | Rol | URL | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|-----|----------------|----------------------|
| Kayıt | Citizen | `/register` | Hesap oluşur; varsayılan rol `citizen` | Rol client'tan değiştirilemez |
| Giriş | Citizen | `/login` | Oturum açılır | — |
| Hesap özeti | Citizen | `/account` | Görünen ad, e-posta, rol, üyelik tarihi | Başka kullanıcı verisi görünmez |
| Soru gönderme | Citizen | `/ask` | Başarı mesajı; soru `pending_review` | — |
| Pending public görünürlük | Citizen | `/questions` | Yeni gönderilen soru listede **yok** | Yayınlanmadan public erişim yok |
| Kendi sorularım | Citizen | `/account#benim-sorularim` | Gönderilen soru listede; durum rozeti doğru | `questions_select_own` RLS |
| Pending detay linki | Citizen | `/account` (pending satır) | Başlık link değil; public URL verilmez | Non-public soruya public link yok |
| Published detay linki | Citizen | `/account` (published satır) | `/questions/[id]` linki çalışır | — |
| Durum sayaçları | Citizen | `/account` | İncelemede/yayında/reddedildi/düzeltme/toplam gerçek veriden | Sahte sayı yok |
| Başkasının pending sorusu | Citizen | `/account` | Görünmez | `author_id` filtresi + RLS |
| Başkasının rejected notu | Citizen | `/account` | Görünmez | Yalnızca kendi `moderation_note` |
| Admin erişimi | Citizen | `/admin` | “Bu alana erişim yetkiniz yok.” | Server-side `requireModeratorAccess` |
| Inspector erişimi | Citizen | `/inspector` | Erişim reddedildi | `canAnswerQuestion` false |
| Cevap yazma | Citizen | `/inspector/questions/[id]` | Erişim reddedildi | Yalnızca `verified_inspector` |

---

## Admin

| Test adı | Rol | URL | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|-----|----------------|----------------------|
| Admin panel | Admin | `/admin` | Özet kartları; moderasyon linki | `requireModeratorAccess` |
| Moderasyon kuyruğu | Admin | `/admin/questions` | `pending_review` sorular listelenir | Citizen pending burada görünür (staff) |
| Soru yayınlama | Admin | `/admin/questions` | Yayınla → kuyruktan düşer; status `published` | Audit log MVP'de kısıtlı |
| Soru reddetme | Admin | `/admin/questions` | Reddet → `rejected`; isteğe bağlı not | Sahip `/account`'ta görür |
| Yayın sonrası public | Admin | `/questions`, `/questions/[id]` | Yayımlanan soru görünür | — |
| Inspector paneli | Admin | `/inspector` | Erişim reddedildi | Admin mesleki cevap yazamaz |
| Cevap yazma | Admin | `/inspector/questions/[id]` | Erişim reddedildi | `canAnswerQuestion` yalnızca müfettiş |
| Hızlı erişim | Admin | `/account` | Yönetim Paneli + Moderasyon Kuyruğu kartları | Rol bazlı UI |

---

## Moderator

| Test adı | Rol | URL | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|-----|----------------|----------------------|
| Admin panel | Moderator | `/admin` | Erişim var (admin ile aynı moderasyon) | `canModerateQuestions` |
| Moderasyon kuyruğu | Moderator | `/admin/questions` | Pending sorular; yayınla/reddet | Belge erişimi yok |
| Inspector paneli | Moderator | `/inspector` | Erişim reddedildi | Moderator cevap yazamaz |
| Müfettiş belgeleri | Moderator | (ileride) | Erişim yok | Yalnızca `admin` |

> Not: MVP'de ayrı moderator bootstrap hesabı yok; test için manuel `profiles.role = moderator` gerekebilir.

---

## Verified Inspector

| Test adı | Rol | URL | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|-----|----------------|----------------------|
| Müfettiş paneli | Verified Inspector | `/inspector` | Özet; cevap bekleyen sayıları | `requireInspectorAccess` |
| Cevap bekleyen sorular | Verified Inspector | `/inspector/questions` | Yayımlanmış sorular; cevapsızlar önce | Yalnızca `published`/`closed` |
| Cevap yazma | Verified Inspector | `/inspector/questions/[id]` | Cevap ≥20 karakter → yayımlanır | `verified_inspector` INSERT policy |
| Public cevap görünürlüğü | Verified Inspector | `/questions/[id]` | Yazılan cevap herkese açık | `published` answer status |
| Admin paneli | Verified Inspector | `/admin` | Erişim reddedildi | Rol ayrımı |
| Hızlı erişim | Verified Inspector | `/account` | Müfettiş Paneli + Cevap Bekleyen Sorular | — |

---

## Inspector Pending

| Test adı | Rol | URL | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|-----|----------------|----------------------|
| Soru gönderme | Inspector Pending | `/ask` | Citizen gibi soru gönderebilir | Cevap yazamaz |
| Müfettiş paneli | Inspector Pending | `/inspector` | Erişim reddedildi | Onay sonrası `verified_inspector` |
| Hesap rol etiketi | Inspector Pending | `/account` | “Müfettiş başvurusu beklemede” açıklaması | — |

> Not: Başvuru UI henüz yok; bu satırlar hedef davranış ve manuel rol testi içindir.

---

## Cross-cutting güvenlik testleri

| Test adı | Rol | URL / yöntem | Beklenen sonuç | Kritik güvenlik notu |
|----------|-----|--------------|----------------|----------------------|
| Unpublished question public detail | Herkes | Doğrudan UUID ile `/questions/[id]` | İçerik açılmaz | `questions_select_published` |
| Published answers only | Guest | `/questions/[id]` | Yalnızca `status=published` cevaplar | Hidden/deleted cevap yok |
| Service role client tarafı | — | Kaynak taraması | `admin.ts` client'ta import edilmez | Tarayıcıda service key yok |
| Rol client manipülasyonu | Citizen | DevTools / forged request | Rol değişmez | RLS + server action |
| Raw Supabase hata | Herkes | Hatalı işlem | Türkçe genel mesaj | İç detay sızmaz |

---

## Smoke test sırası (hızlı)

```
Guest    → /questions
Citizen  → /register → /ask → /account
Admin    → /admin/questions → Yayınla
Inspector→ /inspector/questions/[id] → Cevap
Herkes   → /questions/[id]
```

Detaylı adımlar: `docs/reference/testing/manual-mvp-flow.md`

## İlgili dosyalar

- `docs/project/STATE.md` — canlı durum
- `docs/reference/deploy/vercel-deploy-checklist.md` — deploy sonrası test
- `.cursor/skills/account-flow-test/SKILL.md`
- `.cursor/skills/admin-moderation-flow-test/SKILL.md`
