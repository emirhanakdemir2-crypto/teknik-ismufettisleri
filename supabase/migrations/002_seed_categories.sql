-- 002_seed_categories.sql
-- Temel soru kategorileri (dev seed)
-- Idempotent: slug UNIQUE üzerinden ON CONFLICT DO NOTHING

INSERT INTO public.categories (slug, title, description, section, sort_order, is_active)
VALUES
  (
    'is-sagligi-ve-guvenligi',
    'İş Sağlığı ve Güvenliği',
    'Genel İSG uygulamaları, risk değerlendirme ve saha uygulamaları.',
    'general',
    10,
    TRUE
  ),
  (
    'calisma-sureleri',
    'Çalışma Süreleri',
    'Haftalık çalışma süreleri, fazla mesai ve dinlenme süreleri.',
    'general',
    20,
    TRUE
  ),
  (
    'is-kazasi',
    'İş Kazası',
    'İş kazası bildirimi, soruşturma ve önleme uygulamaları.',
    'general',
    30,
    TRUE
  ),
  (
    'denetim-ve-mevzuat',
    'Denetim ve Mevzuat',
    'Teftiş uygulamaları, mevzuat yorumu ve denetim süreçleri.',
    'general',
    40,
    TRUE
  ),
  (
    'isveren-yukumlulukleri',
    'İşveren Yükümlülükleri',
    'İşveren sorumlulukları, temsilci atama ve yükümlülükler.',
    'general',
    50,
    TRUE
  ),
  (
    'calisan-haklari',
    'Çalışan Hakları',
    'Çalışan hakları, eğitim, sağlık gözetimi ve bilgilendirme.',
    'general',
    60,
    TRUE
  ),
  (
    'diger',
    'Diğer',
    'Diğer iş sağlığı ve güvenliği ile çalışma hayatı soruları.',
    'general',
    70,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;
