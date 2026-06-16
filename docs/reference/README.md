# Proje Referansları

Bu klasör, ürün tanımı, kullanıcı akışları, tasarım yönü ve resmî teknik kaynaklar için kaynak niteliğindedir.

Kaynak ürün kararları `docs/reference/product/product-definition.md` ve `docs/reference/product/user-flows.md` dosyalarında tutulur. Mimari ve güvenlik kuralları `.cursor/rules/` altındadır.

## Klasörler

- `design/`: Görsel referanslar ve tasarım kararları
- `deploy/`: Vercel ve ortam dağıtım kontrol listeleri
- `product/`: Ürün tanımı, kullanıcı akışları ve soru kategorileri
- `security/`: MVP bootstrap ve güvenlik notları
- `technical/`: Resmî teknik dokümantasyon kaynakları
- `testing/`: Manuel test akışları
- `forum-prototype.html`: Görsel prototip; production kodu değildir

## Kullanım Kuralı

- Ürün ve mimari değişikliklerinden önce ilgili ürün dokümanları okunmalıdır.
- Arayüz geliştirmeden önce tasarım notları ve görseller incelenmelidir.
- Sürüm bağımlı teknik kararlarda yalnızca resmî dokümantasyon kaynak alınmalıdır.
- Üçüncü taraf sitelerin kodu, markası, metni ve tasarımı birebir kopyalanmamalıdır.

## Ürün Özeti

- Görünüm: agaclar.net/forum benzeri klasik tablo forumu
- İş mantığı: Müfettişe Sor — moderasyonlu soru-cevap
- Roller: `citizen`, `inspector_pending`, `verified_inspector`, `moderator`, `admin`
- Guest: e-posta doğrulamalı soru başlatabilir; tamamen anonim değildir
