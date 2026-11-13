# I-NEX — лендінг навчальної програми
Домен: Shared · Стан: в роботі — сайт працює (Netlify)
> README за стандартом проєкту — 12.11.2026 (Claude). Генеральна чистка — 13.11.2026 (Claude, погоджено Максимом): ключі Google — у `~/.secrets/i-nex/`, макети й старі плани — в `archive/`. Дані — з файлів проєкту і `Shared/TASKS.md` / `CONTEXT.md`; чого там нема — «❓ уточнити».

## Що це
Лендінг навчальної програми I-NEX: впровадження AI в управління бізнесом для CEO, COO і керівників команд. Netlify + Google Apps Script (форма реєстрації).

## Пріоритети
- ❓ уточнити — з'являються в процесі

## Задачі
**i-nex-landing** (з `Shared/TASKS.md`, перенесено 12.11.2026):

- [ ] **Перевипустити Google OAuth токен (старий засвічений)** — Максим у Google Cloud Console; секрети з історії видалені, але сам токен досі дійсний, поки не перевипущений

## Ідеї
—

## Правила
- **Ритм:** за потребою (Максим, 13.11: «воно працює, домен не купували, усе на Netlify — живе»)
- Як влаштовано і як правити — `knowledge/довідка.md` (попередній README, повністю).

## Журнал
- **13.11.2026 ніч (Claude, домашній ПК, з Максимом):** генеральна чистка: ключі Google → `~/.secrets/i-nex/`; макети, старі плани, README_DEPLOY → `archive/`; lead-magnet «72 теми» закрито ✅; знання з notes-from-kimi → «Важливе».
- **13.11.2026 (Claude, з Максимом):** сайт працює, домен не купували (усе на Netlify) — лишаємо, ритм «за потребою».
- **12.11.2026 (Claude):** README переведено на стандарт проєкту: теки `knowledge/`, `materials/`, `outputs/`, процес — `knowledge/process.md`; перенесено: knowledge/README_DEPLOY.md, knowledge/notes-from-kimi.md, README.md → knowledge/довідка.md; задачі з `Shared/TASKS.md` — сюди (закриті — `README_ARCHIVE.md`). Що невідомо з файлів — позначено «❓ уточнити».
- 2026-10-20 (КІНЕЦЬ СЕСІЇ, Claude Code @ ПК А): I-NEX — Максим надіслав тестову заявку, вона дійшла в таблицю → форма реєстрації працює. Відкрито лишається перевипуск OAuth-ключа Google (Максим).
- 2026-10-16 (КІНЕЦЬ СЕСІЇ, Claude Code @ ПК А Maksym-Progress): **i-nex-landing:** блок «🎁 Подарунок» (PDF «72 теми ранкової наради», скачування вільне — рішення Максима), розклад навчання (2 місяці; Пн і Чт 14:00–15:00 заняття, Ср 14:00–15:00 питання-відповіді), старт **18.01.2027** замість 14 вересня всюди, QR → https://i-nex.netlify.app/#register (`projects/i-nex-landing/qr/`, копія в Завантаження\I-NEX QR). Максим виклав сам (Netlify drop п… (повністю — `Shared/CONTEXT_ARCHIVE.md`)

## Важливе
- Правка сайту: `index.html` → копія в `deploy-final/` (дзеркало для Netlify Drop) → відкрити в браузері; контакти на сайті: +380 (97) 637 37 97 · info@lean-in-progress.consulting (з notes-from-kimi, 13.11)
- ⚠️ Ключі Google OAuth (`client_secret_….json`, `token.json`, `google-config.json`) — з 13.11 на сервері в `~/.secrets/i-nex/` (поза Brain). Токен ще дійсний — перевипустити (безпека №3). Червневі `setup-google.py` / `redeploy-webapp.py` шукають їх у теці проєкту — при запуску вказати новий шлях.
- Знання — `knowledge/` · матеріали — `materials/README.md` · результати й версії — `outputs/README.md` · процес — `knowledge/process.md`
- Сторінка проєкту на пульті — http://pult.brain/p/inex.html
