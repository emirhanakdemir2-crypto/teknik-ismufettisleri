# Müfettişe Sor — Q&A / Forum / Admin UX Blueprint

Bu belge, ürün arayüzünün bilgi mimarisini ve görsel kalıplarını tanımlar. Amaç, referans platformlardan **kullanım kalıbı** almak; birebir site kopyası yapmak değildir.

## Birebir kopya yapılmayacak

Aşağıdakiler **kopyalanmaz**:

- Logo, marka kimliği, renk paleti birebir aktarımı
- Üçüncü taraf CSS/HTML kaynak kodu
- İkon setleri, tipografi paketleri, marka dili
- Piksel düzeyinde aynı sayfa yerleşimi

Aşağıdakiler **esinlenme kaynağıdır** (kalıp düzeyinde):

| Referans mantığı | Alınan kalıp | Müfettişe Sor uyarlaması |
|------------------|--------------|---------------------------|
| Klasik forum tablosu (agaclar.net tarzı) | Kategori/satır tablosu, yoğun bilgi | Kategori listesi, soru sayıları, son cevap özeti |
| Stack Overflow soru listesi | Hızlı taranabilir başlık + meta sütunlar | `/questions` — başlık, kategori, tarih, cevap sayısı |
| Stack Overflow / Q&A detay | Soru üstte, cevaplar altta, net hiyerarşi | `/questions/[id]` — soru kartı + müfettiş cevap listesi |
| Django Admin | Liste, filtre, durum, toplu/tekil işlem | Gelecek admin: tablo + durum rozeti + satır aksiyonları |
| Discourse moderasyon | Bekleyen içerik kuyruğu, durum geçişi | `pending_review` kuyruğu, onay/red/düzenleme isteği |

---

## Tasarım dili

- **Renk:** Kurumsal lacivert, gri, beyaz; vurgu için sınırlı amber/yeşil
- **Tipografi:** 12–14px gövde; tablo başlıkları 10px uppercase
- **Yoğunluk:** Sıkışık ama okunur satırlar; geniş boşluklu startup kartları yok
- **Rozetler:** Sade, metin odaklı `StatusBadge`
- **Dil:** Vatandaşın anlayacağı sade Türkçe
- **Yasal not:** “Bilgilendirme amaçlıdır; nihai hukuki görüş değildir” görünür yerde

---

## 1. Public soru listesi (`/questions`)

**Kalıp:** Forum tablosu + Stack Overflow liste taraması.

| Bölüm | İçerik |
|-------|--------|
| `PageHeader` | Başlık, kısa açıklama, “Soru Sor” birincil aksiyon |
| `InfoNotice` | Yalnızca yayımlanmış içerik listelenir uyarısı |
| `ForumTable` | Başlık (link), kategori, yayımlanma tarihi, cevap sayısı |
| `StatusBadge` | `closed` sorularda “Kapalı” rozeti |
| `EmptyState` | Henüz soru yok + CTA |

**Mobil:** Tablo satırları kart benzeri bloklara dönüşür (`forum-table--responsive`).

**Gösterilmez:** `draft`, `pending_review`, `revision_requested`, `rejected`.

---

## 2. Soru detay (`/questions/[id]`)

**Kalıp:** Q&A — soru üstte, cevaplar kronolojik altta.

| Bölüm | İçerik |
|-------|--------|
| Geri link | Soru listesine dön |
| Soru kartı | Başlık, kategori, tarih, gövde |
| `StatusBadge` | `closed` ise kapalı rozeti + `InfoNotice` |
| Cevap bölümü | Her cevap ayrı kart; müfettiş cevabı etiketi, tarih |
| `EmptyState` | Henüz cevap yok |
| `InfoNotice` (legal) | Bilgilendirme amaçlı uyarı |

**Gösterilmez:** `hidden` / `deleted` cevaplar public sayfada.

---

## 3. Soru sorma formu (`/ask`)

**Kalıp:** Odaklı tek sütun form kartı.

| Bölüm | İçerik |
|-------|--------|
| `PageHeader` / `AuthCard` başlığı | Soru Sor + moderasyon açıklaması |
| Alanlar | Kategori (select), başlık, gövde |
| `InfoNotice` | Kişisel veri uyarısı, moderasyon süreci |
| Başarı | “İncelemeye alındı” mesajı; `pending_review` rozeti açıklaması |
| Boş kategori | “Kategori bulunamadı” `EmptyState` |

**Davranış:** Insert sonrası `pending_review`; kullanıcı public listede görmez.

---

## 4. Ana sayfa

**Kalıp:** Forum ana sayfası — kategoriler + son konular + kurallar.

| Bölüm | İçerik |
|-------|--------|
| Hero | Platform tanımı, birincil CTA: Soru Sor / Soruları İncele |
| Kural kutuları | 3 adım: okuma, moderasyon, müfettiş cevabı |
| Kategori tablosu | Forum klasör hissi; mock veya DB (ileride) |
| Son sorular | `ForumTable` ile gerçek published sorular |
| `InfoNotice` | Bilgilendirme amaçlı genel not |
| Yan panel | Hızlı erişim, özet, admin taslak önizlemesi (mock) |

---

## 5. Admin / moderasyon paneli (gelecek — taslak)

**Kalıp:** Django Admin liste + Discourse moderasyon kuyruğu.

| Bölüm | İçerik |
|-------|--------|
| `AdminShell` | Sol/üst nav, “Moderasyon”, “Sorular”, “Başvurular” (ileride) |
| Liste tablosu | Başlık, gönderen, kategori, durum, tarih |
| Filtre çubuğu | Durum, kategori, tarih (mock) |
| Satır aksiyonları | Onayla, Reddet, Düzenleme iste (mock) |
| `ModerationQueueMock` | Geliştirme önizlemesi; gerçek veri yok |

**Not:** Bu sprintte `/admin` route ve gerçek sorgu yok. Yalnızca UI taslağı.

---

## 6. Müfettiş cevaplama ekranı (gelecek)

**Kalıp:** Q&A cevap editörü — soru özeti üstte, cevap textarea altta.

| Bölüm | İçerik |
|-------|--------|
| Soru özeti | Salt okunur başlık + gövde |
| Cevap editörü | Metin alanı, gönder |
| Uyarı | Yalnızca `verified_inspector`; bilgilendirme amaçlı ifade |

---

## Durum etiketleri (`StatusBadge`)

### Soru (`question_status`)

| Durum | Rozet metni | Ton | Public görünür? |
|-------|-------------|-----|-----------------|
| `draft` | Taslak | neutral | Hayır |
| `pending_review` | İncelemede | amber | Hayır (sahip/admin) |
| `revision_requested` | Düzenleme istendi | blue | Hayır (sahip) |
| `rejected` | Reddedildi | red | Hayır (sahip) |
| `published` | Yayımlandı | green | Evet |
| `closed` | Kapalı | neutral | Evet (okuma; yeni cevap yok) |

### Cevap (`answer_status`)

| Durum | Rozet metni | Ton | Public görünür? |
|-------|-------------|-----|-----------------|
| `published` | Yayımlandı | green | Evet |
| `hidden` | Gizlendi | amber | Hayır |
| `deleted` | Silindi | red | Hayır |

---

## Mobil davranış

- Tablolar `ForumTable responsive` ile kart düzenine geçer
- Header aksiyonları alt alta, tam genişlik buton
- Admin mock tablosu yatay kaydırma veya kart düşümü
- Dokunma hedefleri min. ~36px yükseklik

---

## Bileşen envanteri

| Bileşen | Dosya | Amaç |
|---------|-------|------|
| `ForumTable` | `src/components/ui/forum-table.tsx` | Responsive forum tablosu sarmalayıcı |
| `StatusBadge` | `src/components/ui/status-badge.tsx` | Soru/cevap durum rozeti |
| `EmptyState` | `src/components/ui/empty-state.tsx` | Boş liste durumu |
| `PageHeader` | `src/components/ui/page-header.tsx` | Sayfa başlığı + aksiyon |
| `InfoNotice` | `src/components/ui/info-notice.tsx` | Bilgi/uyarı/yasal not |
| `AdminShell` | `src/components/admin/admin-shell.tsx` | Admin layout taslağı |
| `ModerationQueueMock` | `src/components/admin/moderation-queue-mock.tsx` | Moderasyon kuyruğu önizlemesi |

---

## Uygulama sırası (öneri)

1. Bu blueprint → mevcut public sayfalara bileşen geçişi
2. Admin gerçek route + RLS korumalı sorgular
3. Moderasyon Server Actions + audit log
4. Müfettiş cevap yazma ekranı
