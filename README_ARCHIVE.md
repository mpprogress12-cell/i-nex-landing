# Архів — I-NEX — лендінг навчальної програми

## Закриті задачі (перенесено з TASKS.md домену 12.11.2026)

**i-nex-landing** (з `Shared/TASKS.md`):

- [x] Переписати git-історію (секрети Google OAuth у коміті 51bbad8) → запушити ✅ 14.10 (локальна Kimi): filter-repo прибрав `client_secret_*.json` + `token.json` з усієї історії, gitleaks після = чисто, force-push на GitHub ✅. Бекап з /tmp видалено (містив секрети)

## Журнал (архів)
- 2026-10-14 (КІНЕЦЬ СЕСІЇ): без змін — ПАУЗА триває (TG-бот чекає токен; Progress Bot — факти від Максима). i-nex: чекає перевипуск Google OAuth (Максим).
- 2026-10-14 (11:20, локальна Kimi): **i-nex-landing секрети вигнано з git-історії** — filter-repo (client_secret_*.json + token.json з коміту 51bbad8), gitleaks = чисто, force-push на GitHub ✅. Залишок: Максим перевипускає Google OAuth токен у Cloud Console (історія чиста, але токен дійсний). Раніше цього дня: Shared запушено на brain-shared (gitleaks чисто).
