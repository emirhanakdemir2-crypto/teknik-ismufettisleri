# Design Memory — Müfettişe Sor

> UI/UX hafızası. Her UI sprinti öncesi okunur.

## Design goal

Modern (2026), ciddi, güvenilir bir dernek / forum / Q&A portalı hissi vermek. Kullanıcı platforma güvenerek soru sorabilmeli; müfettiş cevapları okunabilir ve mesleki olmalı.

## Product identity

- **Marka:** Müfettişe Sor — Teknik İşmüfettişleri Derneği
- **Ürün tipi:** Moderasyonlu soru-cevap (klasik tartışma forumu değil)
- **Ton:** Kurumsal, net, bilgi yoğun; eğlenceli veya “startup landing” değil
- **Hedef domain:** `teknikismufettisleri.org.tr` (canlı: Vercel URL)

## Reference interpretation

| Kaynak | Nasıl kullanılır | Nasıl kullanılmaz |
|--------|-------------------|-------------------|
| agaclar.net | Bilgi mimarisi: kategori, arşiv, liste yoğunluğu | Görsel stil, renk, logo, HTML/CSS kopyası |
| `docs/reference/forum-prototype.html` | Yapısal ilham | Production kaynak kodu değil |
| `docs/reference/design/design-notes.md` | Detaylı tasarım notları | — |
| Stack Overflow (kavramsal) | Soru detayı okunabilirliği | Birebir UI kopyası |

## Do not design like

- AI ürün landing page (büyük gradient hero, “powered by AI” hissi)
- 2005 forum tablosu (aşırı eski, piksel kopya agaclar.net)
- Boş dashboard (3 satır hesap bilgisi, işlev yok)
- Fake istatistikler veya demo sayılar
- Public sayfada admin mock / sahte moderasyon kuyruğu
- Aşırı gradient hero veya glassmorphism ağırlığı
- Kart yağmuru ile anlamsız metrik gösterimi

## Preferred UX patterns

- `site-panel` + `forum-table` ile ciddi panel düzeni
- `PageHeader` ile net başlık, kısa açıklama, birincil aksiyon
- `StatusBadge` ile tutarlı durum rozetleri
- `archive-list` ile yayımlanmış soru listesi
- Gerçek veritabanı sayıları (kategori soru sayısı, moderasyon özeti)
- Türkçe, sade hata ve boş durum mesajları (`EmptyState`)
- Formlar: React Hook Form + Zod; auth sayfalarında `AuthCard`

## Navigation rules

- Üst menü (`site-header` / `site-nav`): herkese açık rotalar + oturum durumuna göre Hesabım / Çıkış
- Admin ve müfettiş panelleri yalnızca yetkili rollere görünür (header + `/account` hızlı erişim)
- Misafir `/ask` ve `/account` için login yönlendirmesi (MVP)
- Breadcrumb zorunlu değil; panel başlıkları yeterli

## Role-based UI rules

| Rol | Ek UI |
|-----|-------|
| Guest | Public listeler, login/register |
| Citizen | `/ask`, `/account` (özet + benim sorularım) |
| Admin / Moderator | `/admin`, `/admin/questions`; account'ta yönetim kartları |
| Verified Inspector | `/inspector`, `/inspector/questions`; account'ta müfettiş kartları |
| Inspector Pending | Citizen UI; rol açıklaması “başvuru beklemede” |

Admin mesleki cevap UI'sı gösterilmez (`canAnswerQuestion` yalnızca müfettiş).

## Account dashboard rules

`/account` forum hesabı gibi işlevsel olmalı:

- Hesap özeti tablosu (`account-dl`)
- Soru durum sayaçları (gerçek veri)
- Rol bazlı hızlı erişim kartları (`account-quick-link`)
- Benim sorularım tablosu veya boş durum + “Soru Sor” CTA
- Yayımlanmamış soruya public detay linki **verilmez**
- Mobil: tablolar responsive (`forum-table--responsive`), stat grid 2 sütun

## Admin UI rules

- `AdminPanelShell` / `ForumPanelTable` ile tutarlı panel
- Gerçek `pending_review` kuyruğu (`/admin/questions`); mock kuyruk kullanılmaz
- `admin-stat-card` ile özet sayılar (DB'den)
- Yayınla / reddet aksiyonları net butonlar; Türkçe geri bildirim
- `moderation-queue-mock.tsx` dosyası var ama production'da import edilmemeli

## Public Q&A UI rules

- `/questions`: arama + kategori filtresi; yalnızca yayımlanmış
- `/questions/[id]`: okunabilir soru gövdesi; müfettiş cevapları; yasal bilgilendirme notu
- Ana sayfa: gerçek kategoriler (`getActiveCategories`), mock kaldırıldı
- Kapalı soru (`closed`) badge ile işaretlenir

## Mobile expectations

- Forum tabloları mobilde kart düzenine dönüşür (`forum-table--responsive`)
- Uzun başlıklar taşmaz; dokunma hedefleri yeterli boyutta
- Ana CTA (“Soru Sor”) erişilebilir konumda
- Account stat grid: 2 sütun mobil, 5 sütun geniş ekran
- Quick link grid: 1 → 2 → 3 sütun kırılımları

## İlgili dosyalar

- `docs/reference/design/design-notes.md`
- `docs/reference/design/qa-forum-admin-blueprint.md`
- `src/app/globals.css` — panel, tablo, badge stilleri
- `.cursor/skills/ui-quality-review/SKILL.md`
