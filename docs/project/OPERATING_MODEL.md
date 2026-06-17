# Operating Model — Müfettişe Sor

> İnsan ve agent'ların birlikte çalışma modeli.

## Purpose

Bu doküman, sprint yaşam döngüsünü, sorumlulukları ve zorunlu kontrolleri tanımlar. Amaç: her sprintte bağlam kaybını azaltmak, güvenlik ihlallerini önlemek ve proje hafızasının (`docs/project/`) birikmesini sağlamak.

## Human and agent roles

| Rol | Kim | Sorumluluk |
|-----|-----|------------|
| Ürün sahibi | Emirhan | Son karar, sprint önceliği, commit/push/migration onayı |
| Sprint tasarımcısı | ChatGPT | Sprint kapsamı, mimari rehberlik, verifier/review |
| Maker agent | Cursor | Kod ve dokümantasyon yazımı, lint/build, sprint raporu |

Agent tek başına production kararı vermez; kullanıcı açık izin vermedikçe commit/push/deploy yapmaz (sprint talimatında izin varsa uygulanır).

## Sprint lifecycle

```
1. BAŞLANGIÇ
   ├─ docs/project/STATE.md oku
   ├─ Görev tipine göre DESIGN_MEMORY.md ve/veya TEST_MATRIX.md oku
   ├─ İlgili .cursor/rules/*.mdc ve docs/reference/ oku
   └─ Uygun .cursor/skills/ skill'ini seç

2. PLAN
   ├─ Kapsam + kapsam dışı maddeleri yaz
   ├─ DB/auth/security ise kısa plan sun; migration ihtiyacını erken işaretle
   └─ Çelişki varsa dur ve raporla

3. UYGULAMA
   ├─ Küçük, review edilebilir diff
   ├─ Mevcut convention'lara uy
   └─ İlgisiz dosyaya dokunma

4. DOĞRULAMA
   ├─ npm run lint
   ├─ npm run build
   ├─ (SQL/Türkçe değiştiyse) git diff --check
   └─ İlgili skill verification adımları

5. KAPANIŞ
   ├─ sprint-closeout skill raporu
   ├─ STATE.md güncelle (yapılanlar, yeni riskler, sonraki sprint)
   └─ Kullanıcı onayıyla commit/push (talimat varsa)
```

## Before coding checklist

- [ ] `docs/project/STATE.md` okundu
- [ ] UI işi → `docs/project/DESIGN_MEMORY.md` okundu
- [ ] Test/güvenlik işi → `docs/project/TEST_MATRIX.md` okundu
- [ ] İlgili `.cursor/rules/` dosyaları okundu
- [ ] Sprint kapsamı ve **yapılmayacaklar** net
- [ ] Migration gerekip gerekmediği değerlendirildi
- [ ] Uygun proje skill'i belirlendi

## During coding rules

- Mevcut dosyaları incele; gereksiz abstraction ekleme
- Tablo, kolon, enum, rol, env variable uydurma
- Server Component varsayılan; yalnızca gerektiğinde `"use client"`
- Authorization: RLS + server-side; UI gizleme tek başına yetmez
- Kullanıcıya dönük hatalar Türkçe; raw Supabase hatası sızdırma
- Secret, `.env.local` içeriği isteme veya rapora yazma

## Verification checklist

Her kod sprinti sonunda:

```bash
git status --short
git diff --check          # SQL veya Türkçe metin değiştiyse
npm run lint
npm run build
git ls-files .env.local   # boş olmalı
```

Ek koşullar:

- Lint veya build başarısız → commit/push yok
- `.env.local` tracked → commit/push yok
- Dokümanda secret/key/token → commit/push yok; dosyayı düzelt

## Sprint closeout report format

`sprint-closeout` skill şablonunu kullan. Minimum bölümler:

1. **Yapılanlar** — ne değişti, neden
2. **Değişen dosyalar** — tablo
3. **Kontroller** — lint, build, diff --check sonuçları
4. **DB/migration** — evet/hayır; dosya listesi
5. **Security risk** — var/yok
6. **Yapılmayanlar** — bilinçli kapsam dışı
7. **Sonraki adım** — öneri
8. **Git/deploy** — commit hash, push durumu

## When to stop and ask

Aşağıdaki durumlarda kod yazmadan dur ve kullanıcıya raporla:

- RLS/policy değişikliği veya migration gerekiyor ama sprintte yasak
- `.cursor/rules` ile kullanıcı talimatı çelişiyor
- Service role kullanımı gerekiyor ama onay yok
- Mevcut şemada olmayan tablo/kolon/rol ihtiyacı
- Auth veya güvenlik modelinde belirsizlik
- Lint/build düzeltilemiyor

## Forbidden actions

- `git push --force`
- `.env.local` okuma, yazma, commit
- Secret / API key / token rapora veya dokümana yazma
- `src/lib/supabase/admin.ts` client import
- Service role'u tarayıcıya expose etme
- Migration veya RLS değişikliğini sessizce yapma
- Kimlik belgesini AI sağlayıcısına gönderme
- Kurallarla çelişen büyük refactor (açık talimat olmadan)

## How memory compounds

| Dosya | Ne zaman | Ne kaydeder |
|-------|----------|-------------|
| `STATE.md` | Her sprint başı/sonu | Canlı durum, riskler, tamamlanan fazlar |
| `DESIGN_MEMORY.md` | UI sprintleri | Tasarım kararları, kaçınılacaklar |
| `TEST_MATRIX.md` | Test/güvenlik | Manuel test senaryoları |
| `OPERATING_MODEL.md` | Nadiren | Çalışma modeli (bu dosya) |
| `.cursor/skills/` | Skill ihtiyacında | Tekrarlanabilir inceleme/test prosedürleri |
| `docs/reference/` | Ürün/mimari referans | Uzun ömürlü spec ve checklist |

Sprint sonunda `STATE.md` güncellenmezse bir sonraki sprint yanlış varsayımlarla başlar. Agent her sprint kapanışında en az şunları günceller:

- `Completed phases` / `Current production status`
- `Known risks` / `Pending decisions`
- `Next recommended sprint`
- Son commit hash (push yapıldıysa)
