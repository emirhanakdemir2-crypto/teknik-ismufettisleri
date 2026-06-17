---
name: sprint-closeout
description: Müfettişe Sor sprint kapanış raporu. Kod veya dokümantasyon sprinti bittiğinde, kullanıcı rapor istediğinde veya commit/push öncesinde kullan.
disable-model-invocation: false
---

# Sprint Closeout — Müfettişe Sor

## Purpose

Her sprint sonunda tutarlı kapanış raporu üretmek; lint/build/git/env/güvenlik kontrollerini zorunlu kılmak ve `docs/project/STATE.md` güncellemesini hatırlatmak.

## When to use

- Kod, UI, migration veya dokümantasyon sprinti tamamlandığında
- Kullanıcı “sprint raporu”, “closeout” veya commit/push öncesi kontrol istediğinde
- Agent commit/push yapmadan önce (kullanıcı izni varsa)

## Required context files

- `docs/project/STATE.md`
- `docs/project/OPERATING_MODEL.md`
- İlgili sprint talimatı (kapsam / yapılmayacaklar)
- `AGENTS.md` ve ilgili `.cursor/rules/*.mdc`

## Steps

1. Sprint kapsamını özetle: ne istendi, ne yapıldı, ne bilinçli olarak yapılmadı.
2. Değişen dosyaları listele (gruplu tablo).
3. Zorunlu kontrolleri çalıştır:

```bash
git status --short
git diff --check
npm run lint
npm run build
git ls-files .env.local
```

4. SQL/Türkçe dosya değiştiyse `git diff --check` sonucunu raporla.
5. Migration değişikliği var mı kontrol et (`supabase/migrations/`).
6. Service role, `admin.ts` import, secret sızıntısı var mı tara (değişen dosyalarda).
7. `docs/project/STATE.md` güncelleme gerekiyorsa öner veya güncelle (dokümantasyon sprintinde zorunlu).
8. Commit/push durumunu kullanıcı talimatına göre belirt.

## Verification

- [ ] `npm run lint` başarılı
- [ ] `npm run build` başarılı
- [ ] `git ls-files .env.local` boş
- [ ] Raporda secret/key/token yok
- [ ] DB/migration bölümü dolduruldu
- [ ] Security risk bölümü dolduruldu

## Stop conditions

Aşağıdakilerden biri varsa commit/push önerme; önce düzelt veya kullanıcıya sor:

- Lint veya build başarısız
- `.env.local` tracked
- Dokümanda veya koda secret yazılmış
- Migration gerekiyor ama sprintte yasaktı (raporla, dur)
- Çözülmemiş kritik güvenlik riski

## Report format

```markdown
## Sprint Closeout — [Sprint adı]

### Yapılanlar
- ...

### Değişen dosyalar
| Dosya | Özet |
|-------|------|

### Çalıştırılan kontroller
| Kontrol | Sonuç |
|---------|-------|
| `git status --short` | ... |
| `git diff --check` | ... |
| `npm run lint` | ... |
| `npm run build` | ... |
| `git ls-files .env.local` | ... |

### DB / migration değişti mi?
- Evet/Hayır — ...

### Service role kullanıldı mı?
- Evet/Hayır — ...

### Security risk
- Var/Yok — ...

### Yapılmayanlar (bilinçli kapsam dışı)
- ...

### STATE.md güncellendi mi?
- Evet/Hayır — ...

### Sonraki önerilen adım
- ...

### Git / deploy
- Commit hash: ...
- Push: başarılı / yapılmadı / kullanıcı bekleniyor
```

## Forbidden actions

- Secret, `.env.local` içeriği veya API key rapora yazma
- Lint/build başarısızken commit/push yapma önerisi
- `git push --force`
- Kontrol yapmadan “tamamlandı” deme
