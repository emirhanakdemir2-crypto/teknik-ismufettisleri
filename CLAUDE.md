@AGENTS.md

# Claude Code Instructions

* Read `docs/project/STATE.md` at the start of each sprint.
* Read the relevant `.cursor/rules/*.mdc` files before planning or changing code.
* For UI work, read `docs/project/DESIGN_MEMORY.md`.
* For security/test work, read `docs/project/TEST_MATRIX.md`.
* Use plan mode before multi-file, database, authentication, authorization, or security changes.
* Do not duplicate or override the project rules defined under `.cursor/rules/`.
* Update `docs/project/STATE.md` at sprint closeout; use `.cursor/skills/` when applicable.
* Ask before making destructive database changes or removing existing functionality.

## Commit attribution

* Commit author/committer: **Emirhan Akdemir** `<emirhanakdemir9@gmail.com>`
* Do not add `Co-authored-by`, `cursoragent`, `Cursor`, or bot attribution lines to commit messages.
* Before commit: verify `git config user.name` and `git config user.email` (read-only).
* After commit: verify with `git log -1`; if bot/agent attribution appears, do not push.
* Never rewrite history or `git push --force`.
