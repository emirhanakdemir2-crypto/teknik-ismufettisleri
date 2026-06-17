# Teknik İşmüfettişleri Platformu — Agent Guide

## Source of Truth

Before making changes, read the relevant files under:

* `docs/project/STATE.md` — yaşayan proje hafızası (her sprint başında)
* `.cursor/rules/`
* `docs/reference/`

The `.cursor/rules` directory is the primary source of truth for architecture, security, authorization, database, moderation, and testing rules.

**Compound memory (sprint disiplini):**

* Sprint başında: `docs/project/STATE.md`
* UI işlerinde: `docs/project/DESIGN_MEMORY.md`
* Test/güvenlik işlerinde: `docs/project/TEST_MATRIX.md`
* Çalışma modeli: `docs/project/OPERATING_MODEL.md`
* Sprint sonunda: `STATE.md` güncelle; uygun `.cursor/skills/` skill'ini kullan (`sprint-closeout`, `supabase-rls-review`, vb.)

If instructions conflict, stop and report the conflict before modifying code.

## Product Summary

This project is a public, moderated question-and-answer platform branded as **Müfettişe Sor**.

**Visual model:** Classic, table-based forum layout (agaclar.net/forum style) — dense, serious, corporate.

**Business model:** Moderated Q&A — not a free discussion forum.

* Everyone can read published questions and inspector answers.
* Registered citizens can submit questions.
* Guests can start a question without a full account, but only after **email verification** (magic link or equivalent); not anonymous.
* Citizens and guests cannot write professional answers.
* Questions enter `pending_review` and are not published until a **moderator or admin** approves them.
* Only **verified inspectors** (`verified_inspector`) can submit professional answers.
* In v1, inspector answers publish immediately; admin can hide or delete them later.
* Inspector applicants upload identity/service documents; only **admin** approves or rejects applications.
* Documents live in private storage; only admin can view them; access is audit-logged.
* Documents must never be sent to an AI provider.
* Published questions and answers are publicly visible.

## Critical Security Rules

* Never expose Supabase secret or service-role keys to client code.
* Never use real personal data in development or test fixtures.
* Inspector identity documents are private and admin-only.
* Inspector identity documents must never be sent to an AI provider.
* Documents must never be exposed to the client as public URLs.
* Database changes must be implemented through SQL migrations.
* Authorization must be enforced with Supabase RLS and server-side checks.
* `proxy.ts` handles session refresh and lightweight route guards; it is not the authorization system.
* Administrative and moderation actions must be recorded in audit logs.

## Development Workflow

* `.cursor/rules/` birincil source of truth'tur; `AGENTS.md` özet rehberdir.
* Agent `git commit`, `git push`, `supabase db push` ve production deploy çalıştırmaz; bu adımlar yalnızca kullanıcı tarafından yapılır.
* DB, auth ve güvenlik dosyalarında agent önce kısa plan sunar; küçük diff ile ilerler.
* Secret, `.env.local` içeriği veya gerçek API anahtarı istenmez ve rapora yazılmaz.
* Inspect existing files before creating new abstractions.
* Make small, reviewable changes.
* Do not invent tables, columns, roles, environment variables, or dependencies.
* Do not modify unrelated files.
* Run relevant validation commands after changes.
* Report changed files, validation results, and unresolved risks.

## Commit Attribution

GitHub commit geçmişinde agent veya bot adı görünmemelidir. Eski commit'ler rewrite edilmez; `git push --force` yasaktır.

**Zorunlu author/committer:**

| Alan | Değer |
|------|-------|
| Name | `Emirhan Akdemir` |
| Email | `emirhanakdemir9@gmail.com` |

**Kurallar:**

* Commit mesajına `Co-authored-by`, `cursoragent`, `Cursor`, bot adı veya otomatik agent attribution satırı **eklenmez**.
* Commit öncesi kontrol (salt okunur; `git config` değiştirilmez):

```bash
git config user.name
git config user.email
```

Beklenen: `Emirhan Akdemir` ve `emirhanakdemir9@gmail.com`. Farklıysa commit yapma; kullanıcıya bildir.

* Commit sonrası doğrulama:

```bash
git log -1 --format="%h %an <%ae> | %cn <%ce> | %s"
git log -1 --format="%B"
```

Author veya committer içinde `cursoragent`, `Cursor`, bot adı görünürse veya mesajda `Co-authored-by` varsa **push yapma**.

**Cursor IDE:** Otomatik `Co-authored-by: Cursor <cursoragent@cursor.com>` eklenmesini durdurmak için **Cursor Settings → Agent → Attribution** kapalı olmalıdır. Agent `git config` değiştirmez; IDE attribution açıksa commit sonrası kontrol başarısız olur ve push yapılmaz.
