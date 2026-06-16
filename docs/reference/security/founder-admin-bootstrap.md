# Kurucu Admin Bootstrap (MVP / Dev)

## Amaç

Geliştirme ve MVP aşamasında ilk yönetici hesabını güvenli ve tekrarlanabilir şekilde oluşturmak.

## Yöntem

`supabase/migrations/003_bootstrap_founder_admin.sql` migration'ı:

1. `handle_new_user()` trigger fonksiyonunu günceller.
2. Yeni kayıt olan `emirhanakdemir9@gmail.com` adresine `admin` rolü atar.
3. Diğer tüm yeni kayıtlar `citizen` olarak kalır.
4. Migration çalıştığında `auth.users` içinde bu e-posta ile mevcut kullanıcı varsa `profiles.role` değeri `admin` yapılır.

## Founder e-posta

`emirhanakdemir9@gmail.com`

Bu adres public dokümantasyonda yer alır; secret değildir. Buna rağmen rol ataması güvenlik hassasiyetindedir.

## Güvenlik notları

- Rol ataması yalnızca migration ve `SECURITY DEFINER` trigger seviyesinde yapılır.
- Client veya Server Action üzerinden kullanıcıdan rol alınmaz.
- `protect_profiles_role` trigger'ı oturumlu kullanıcıların `profiles.role` güncellemesini engellemeye devam eder.
- Bu yöntem production için kalıcı çözüm değildir.

## Production öncesi

Production öncesinde bu bootstrap kaldırılmalı veya devre dışı bırakılmalıdır. Yerine:

- Admin davet sistemi
- Güvenli role management (service role + audit log)
- Kurumsal IAM / operasyon prosedürü

kullanılmalıdır.

## Public repo

Depo public yapılacaksa founder e-posta sabiti ve bootstrap mantığı yeniden değerlendirilmelidir.
