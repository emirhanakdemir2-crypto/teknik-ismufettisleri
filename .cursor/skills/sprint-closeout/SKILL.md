---
name: sprint-closeout
description: Müfettişe Sor sprint kapanış raporu. Kod veya dokümantasyon sprinti bittiğinde, kullanıcı rapor istediğinde veya commit/push öncesinde kullan.
disable-model-invocation: false
---

# Sprint Closeout — Müfettişe Sor

## Purpose

Her sprint sonunda tutarlı kapanış raporu üretmek; lint/build/git/env/güvenlik ve **commit attribution** kontrollerini zorunlu kılmak; `docs/project/STATE.md` güncellemesini hatırlatmak.

## When to use

- Kod, UI, migration veya dokümantasyon sprinti tamamlandığında
- Kullanıcı “sprint raporu”, “closeout” veya commit/push öncesi kontrol istediğinde
- Agent commit/push yapmadan önce (kullanıcı izni varsa)

## Required context files

- `docs/project/STATE.md`
- `docs/project/OPERATING_MODEL.md`
- `AGENTS.md` — Commit Attribution bölümü
- `.cursor/rules/09-agent-sprint-workflow.mdc`
- İlgili sprint talimatı (kapsam / yapılmayacaklar)

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

### Commit attribution (commit/push varsa zorunlu)

**Commit öncesi** — salt okunur; `git config` değiştirme:

```bash
git config user.name    # beklenen: Emirhan Akdemir
git config user.email   # beklenen: emirhanakdemir9@gmail.com
```

**Commit sonrası** — push öncesi:

```bash
git log -1 --format="%h %an <%ae> | %cn <%ce> | %s"
git log -1 --format="%B"
```

Kontrol listesi:

- Author name = `Emirhan Akdemir`
- Author email = `emirhanakdemir9@gmail.com`
- Committer name/email aynı (veya en azından bot değil)
- Mesaj gövdesinde `Co-authored-by` **yok**
- Author, committer veya mesajda `cursoragent`, `Cursor` (bot olarak), veya bilinen bot adı **yok**

Bot/agent attribution tespit edilirse → **push yapma**; kullanıcıya bildir.

8. Commit/push durumunu kullanıcı talimatına göre belirt.

## Verification

- [ ] `npm run lint` başarılı
- [ ] `npm run build` başarılı
- [ ] `git ls-files .env.local` boş
- [ ] Raporda secret/key/token yok
- [ ] DB/migration bölümü dolduruldu
- [ ] Security risk bölümü dolduruldu
- [ ] Son commit author/committer doğrulandı (`Emirhan Akdemir <emirhanakdemir9@gmail.com>`)
- [ ] Commit mesajında `Co-authored-by` yok
- [ ] `cursoragent` / bot attribution yok

## Stop conditions

Aşağıdakilerden biri varsa commit/push önerme; önce düzelt veya kullanıcıya sor:

- Lint veya build başarısız
- `.env.local` tracked
- Dokümanda veya koda secret yazılmış
- Migration gerekiyor ama sprintte yasaktı (raporla, dur)
- Çözülmemiş kritik güvenlik riski
- **Son commit author/committer bot veya `cursoragent` içeriyor**
- **Commit mesajında `Co-authored-by` veya agent attribution var**

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

### Commit attribution
| Kontrol | Sonuç |
|---------|-------|
| `git config user.name` | ... |
| `git config user.email` | ... |
| `git log -1` (author/committer) | ... |
| `Co-authored-by` | yok / VAR — push yapılmadı |
| Bot/cursoragent attribution | yok / VAR — push yapılmadı |

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
- Author/committer: ...
- Push: başarılı / yapılmadı / attribution hatası
```

## Forbidden actions

- Secret, `.env.local` içeriği veya API key rapora yazma
- Lint/build başarısızken commit/push yapma önerisi
- `git push --force` veya geçmiş rewrite
- `git config user.name` / `user.email` değiştirme (agent)
- `Co-authored-by` veya agent attribution satırı ekleme
- Bot attribution görünürken push yapma
- Kontrol yapmadan “tamamlandı” deme

**Cursor IDE notu:** `Co-authored-by` otomatik ekleniyorsa kullanıcı **Cursor Settings → Agent → Attribution** ayarını kapatmalıdır; ardından commit amend veya yeni commit ile tekrar denenir.
