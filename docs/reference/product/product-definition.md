# Ürün Tanımı

Bu proje klasik tartışma forumu değildir.

**Görünüm:** agaclar.net/forum benzeri klasik, tablo tabanlı, ciddi forum düzeni.

**İş mantığı:** “Müfettişe Sor” — moderasyonlu soru-cevap platformu.

Platformun temel amacı:

- Vatandaşların ve e-posta doğrulamalı misafirlerin İSG soruları sorması
- Soruların `pending_review` durumunda moderasyon beklemesi
- Yalnızca doğrulanmış müfettişlerin (`verified_inspector`) mesleki cevap yazması
- Yayımlanan soru ve cevapların herkes tarafından okunabilmesi
- Biriken cevapların zamanla kamuya açık bilgi bankasına dönüşmesi

## Temel İlkeler

- Herkes yayımlanmış soru ve müfettiş cevaplarını okuyabilir.
- Kayıtlı vatandaşlar (`citizen`) soru gönderebilir.
- Misafirler (guest) hesap açmadan soru formu doldurabilir; soru sisteme alınmadan önce **e-posta doğrulaması** (magic link veya eşdeğeri) zorunludur. Tamamen anonim misafir soru yoktur.
- Vatandaşlar ve misafirler mesleki cevap yazamaz.
- Sorular doğrudan yayımlanmaz; önce `pending_review` durumuna düşer.
- Admin veya moderatör soruyu onaylarsa yayımlanır.
- Müfettiş cevabı v1’de doğrudan yayımlanabilir; admin sonradan gizleyebilir veya silebilir. İleride cevap onay akışı eklenebilir.
- Müfettiş adayı belge/görev kimliği yükleyerek başvurur; başvuru durumu `pending` olur.
- Yalnızca admin müfettiş başvurusunu onaylar veya reddeder.
- Onay sonrası kullanıcı `verified_inspector` rolünü alır.
- Müfettiş kimlik belgeleri private storage alanında tutulur; yalnızca admin görür.
- Belge erişimleri audit log'a yazılır.
- Kimlik belgeleri client tarafına public URL olarak verilmez.
- Kimlik belgeleri hiçbir yapay zekâ sağlayıcısına gönderilmez.
- Yayımlanmış soru ve cevaplar kamuya açıktır.
- Moderasyon ve yönetim işlemleri audit log'a yazılır.

## Soru Yaşam Döngüsü

Migration'daki enum adları migration dosyasından okunur. Ürün akışı:

- `draft` — sahibi düzenler (citizen)
- `pending_review` — moderasyon kuyruğunda; admin veya moderatör inceler
- `revision_requested` — sahibi tekrar düzenleyebilir
- `rejected` — yayımlanmaz; sahip görür
- `published` — herkese açık

Misafir sorularında e-posta doğrulanmadan `pending_review` durumuna geçilmez.

## Cevap Yaşam Döngüsü (v1)

- Yalnızca `verified_inspector` yayımlanmış soruya cevap gönderir.
- Cevap v1’de doğrudan yayımlanır.
- Müfettiş yalnızca kendi cevabını düzenler.
- Admin cevabı gizleyebilir veya silebilir; işlem audit log'a yazılır.

## Roller

Veritabanı rolleri:

- `citizen`
- `inspector_pending`
- `verified_inspector`
- `moderator`
- `admin`

`guest` veritabanı rolü değildir; oturum açmamış ziyaretçi durumudur. Guest okuyabilir ve e-posta doğrulamalı soru başlatabilir.

Yönetim Kurulu, Denetim Kurulu veya Onur Kurulu için ayrı yazılım rolü oluşturulmaz.
