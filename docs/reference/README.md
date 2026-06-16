# Proje Referansları

Bu klasör, ürün tanımı, kullanıcı akışları, tasarım yönü ve resmî teknik kaynaklar için kaynak niteliğindedir.

Kaynak ürün kararları `docs/reference/product/product-definition.md` ve `docs/reference/product/user-flows.md` dosyalarında tutulur. Mimari ve güvenlik kuralları `.cursor/rules/` altındadır.

## Klasörler

- `design/`: Görsel referanslar ve tasarım kararları
- `product/`: Ürün tanımı, kullanıcı akışları ve soru kategorileri
- `technical/`: Resmî teknik dokümantasyon kaynakları
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
