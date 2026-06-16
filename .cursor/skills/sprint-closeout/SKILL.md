---
name: sprint-closeout
description: Sprint sonu kapanış raporu üret. lint/build sonrası, görev tamamlandığında veya kullanıcı sprint raporu istediğinde kullan.
disable-model-invocation: false
---

# Sprint Closeout Report

Sprint bittiğinde aşağıdaki formatta rapor üret. Eksik kontrol varsa önce `npm run lint` ve `npm run build` çalıştır.

## Rapor Şablonu

```markdown
## Sprint Closeout

### Yapılanlar
- ...

### Değişen dosyalar
| Dosya | Özet |
|-------|------|

### Çalıştırılan kontroller
- [ ] `npm run lint` — sonuç
- [ ] `npm run build` — sonuç
- [ ] `git diff --check` — (SQL/Türkçe değiştiyse)

### Lint sonucu
...

### Build sonucu
...

### DB / migration değişti mi?
- Evet/Hayır — dosya listesi veya "Bu sprintte migration yok"

### Security risk
- Var/Yok — kısa açıklama

### Yapılmayanlar (bilinçli kapsam dışı)
- ...

### Sonraki önerilen adım
- ...

### Git / deploy
- Commit: yapılmadı / kullanıcı isteğiyle yapıldı
- Push: yapılmadı / kullanıcı isteğiyle yapıldı
- Migration push: yapılmadı / kullanıcı tarafından yapıldı
```

## Kurallar

- Secret, `.env.local` içeriği veya gerçek API key rapora yazılmaz.
- Agent commit/push/migration push yapmadıysa açıkça **yapılmadı** yaz.
- Çözülmemiş riskleri gizleme.
