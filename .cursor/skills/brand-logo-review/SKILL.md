---
name: brand-logo-review
description: Müfettişe Sor marka logosu incelemesi. Logo değişikliği, header marka alanı veya public/brand dosyaları değiştiğinde kullan.
disable-model-invocation: true
paths: src/components/brand/**,public/brand/**,src/components/site-header.tsx,docs/project/DESIGN_MEMORY.md
---

# Brand Logo Review — Müfettişe Sor

## Purpose

Kaynak logoya dayalı `SiteLogo` sisteminin kurumsal, okunaklı ve site paletiyle uyumlu olduğunu doğrulamak; devlet amblemi veya AI/startup logo kalıplarından kaçınıldığını kontrol etmek.

## When to use

- `src/components/brand/site-logo.tsx` veya `public/brand/` değiştiğinde
- Header marka alanı güncellendiğinde
- Yeni logo varyantı eklendiğinde
- Kullanıcı “logo uygun mu?” diye sorduğunda

## Required context files

- `public/brand/logo-source.jpeg` (veya `logo-source.*`)
- `docs/project/DESIGN_MEMORY.md` — Logo and brand rules
- `src/components/brand/site-logo.tsx`
- `src/components/site-header.tsx`
- `src/app/globals.css` — `.site-logo*` stilleri

## Brand rules

- Kaynak logonun ana fikri korunur: müfettiş/inceleme (fedora, büyüteç, onay).
- Ham PNG/JPG header’da doğrudan kullanılmaz; inline SVG mark tercih edilir.
- Renkler: zeytin (`--navy`), kemik (`--header-on-primary`), bakır vurgu (`--copper`).
- Devlet amblemi, resmi mühür, bakanlık logosu hissi yasak.
- Parlak mavi/mor gradient, neon, aşırı çok renk yasak.

## Logo checklist

- [ ] Küçük boyutta (32–40px mark) ana semboller seçilebiliyor mu?
- [ ] Header’da yatay taşma yok mu? (`ellipsis`, responsive full/compact)
- [ ] Mobilde nav/auth ile çakışmıyor mu?
- [ ] Kaynak logonun fedora + büyüteç + onay fikri korunmuş mu?
- [ ] Endüstriyel arka plan / TİMDER metin halkası gereksiz karmaşa yaratmıyor mu?
- [ ] Devlet amblemi gibi durmuyor mu?
- [ ] AI gradient/startup logosu gibi durmuyor mu?
- [ ] Zeytin/kemik/bakır paletiyle uyumlu mu?

## Forbidden patterns

- Ham `logo-source` raster görseli `<img>` ile header’da
- Yeni npm paketi ile logo üretimi veya otomatik trace
- Parlak mavi/mor gradient, neon stroke
- Resmi mühür, kartal, taç, bakanlık amblemi kopyası
- Sıfırdan alakasız ikon (kaynak fikirden kopuk)

## Verification

```bash
npm run lint
npm run build
```

Manuel: 375px ve 1280px viewport’ta header marka alanı.

## Report format

```markdown
## Brand Logo Review

### Kaynak
- Dosya: ...
- Korunan fikir: ...

### Varyantlar
| Varyant | Kullanım | Uygun mu? |
|---------|----------|-----------|

### Checklist
- Küçük boyut: ...
- Header taşma: ...
- Mobil: ...
- Palet uyumu: ...
- Yasak kalıp: yok / VAR

### Öneri
- ...
```
