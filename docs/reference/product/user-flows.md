# Kullanıcı Akışları

## Ziyaretçi (Guest)

1. Ana sayfayı açar.
2. Yayımlanmış soruları arar ve okur.
3. Müfettiş cevaplarını görür.
4. Soru sormak için soru formunu doldurur (hesap açmadan).
5. E-posta adresini girer; doğrulama bağlantısı (magic link) alır.
6. E-posta doğrulandıktan sonra soru `pending_review` durumuna geçer.
7. Moderatör veya admin onayladığında soru yayımlanır.

Misafir soru tamamen anonim değildir; e-posta doğrulaması ve rate limit zorunludur.

## Vatandaş (Citizen)

1. E-posta ile kayıt olur.
2. E-posta adresini doğrular.
3. Varsayılan rol: `citizen`.
4. Sorusunu taslak olarak hazırlar.
5. Soruyu moderasyona gönderir (`pending_review`).
6. Soru yayımlandığında veya düzenleme istendiğinde bildirim alır.
7. Müfettiş cevabı geldiğinde bildirim alır.
8. Başka kullanıcıların sorularına mesleki cevap yazamaz.

## Müfettiş Adayı (Inspector Pending)

1. Normal hesap oluşturur (`citizen`).
2. Müfettiş doğrulama başvurusu yapar.
3. Kimlik/görev belgesini private storage alanına yükler.
4. Rol `inspector_pending` olur; başvuru durumu `pending`.
5. Yalnızca admin incelemesini bekler.
6. Onaylanırsa `verified_inspector` rolünü alır.

## Doğrulanmış Müfettiş (Verified Inspector)

1. Yayımlanmış soruları görür.
2. Mesleki cevap gönderir; v1’de cevap doğrudan yayımlanır.
3. Yalnızca kendi cevabını düzenler.
4. Başka müfettişlerin cevaplarını değiştiremez.

## Moderatör

1. `pending_review` durumundaki soruları inceler.
2. Soruyu yayımlar, düzenleme ister veya reddeder.
3. v1’de cevap moderasyon kuyruğu yoktur; cevaplar doğrudan yayımlanır.
4. Müfettiş kimlik belgelerini göremez.

## Admin

1. Müfettiş doğrulama başvurularını inceler (yalnızca admin).
2. Müfettiş rolünü onaylar veya reddeder.
3. Soru moderasyonu yapabilir (moderatör ile aynı yetki).
4. Cevabı gizleyebilir veya silebilir.
5. Kullanıcı ve rol işlemlerini yönetir.
6. Kritik işlemleri audit log'a kaydeder.

## Akış Özeti

```
Guest/Citizen soru → (guest: e-posta doğrulama) → pending_review
  → Moderator veya Admin onay → published
  → verified_inspector cevap → v1 doğrudan yayın
  → Admin gerekirse gizle/sil
```
