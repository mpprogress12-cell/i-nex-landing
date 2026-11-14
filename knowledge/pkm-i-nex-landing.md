---
type: project
key_element: [[i-nex]]
status: active
started: 2026-06-16
---

# I-NEX Landing Page

**Проєкт:** Лендінг для реєстрації учасників на AI-навчання I-NEX для CEO та керівників компаній.

**Key Element:** [[i-nex]]

**Цей проєкт:** ongoing — активний поки триває набір на навчання

---

## Опис

Лендінг презентує навчальну програму I-NEX під брендом Progress Group. Сайт містить:
- Hero-блок із закликом до дії
- Секцію проблем (чому бізнес буксує)
- I-NEX Framework
- MAP-методологію (Mine / Assemble / Perform)
- Цільову аудиторію
- Переваги та пропозицію
- Ціни та спецумови
- Форму реєстрації

## Технічний стек

- **Хостинг:** Netlify (static hosting)
- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Форма:** Google Apps Script Web App → Google Sheets
- **Репозиторій:** `/srv/brain/Shared/projects/i-nex-landing\`

## URL

- **Production:** https://i-nex-ai.netlify.app
- **Reserve / test:** https://i-nex-ai-v2.netlify.app
- **Google Sheet:** https://docs.google.com/spreadsheets/d/1o-vt9C2p9uYASldJbs-5sHSkQL2JbZhnnF6CUHt4mlY/edit
- **Google Apps Script Web App:** https://script.google.com/macros/s/AKfycbyf-OZ3tenynkF2iWdhSBHSldkLcICtO9gziwHa9-hJ8I0oWLXMXGUZusIseKvjqvac3g/exec

## Контакти на сайті

- Телефон: [+380 (97) 637 37 97](tel:+380976373797)
- Email: [info@lean-in-progress.consulting](mailto:info@lean-in-progress.consulting)

## Ресурси

- **Проєктна папка:** `/srv/brain/Shared/projects/i-nex-landing\`
- **Деплой-папка:** `/srv/brain/Shared/projects/i-nex-landing\deploy-v2\`
- **Архів для деплою:** `/srv/brain/Shared/projects/i-nex-landing\i-nex-landing-v2.zip`
- **Вихідні файли директора:** `C:\Users\mppro\Downloads\Telegram Desktop\1files\i-nex-site\`
- **Google Apps Script backend:** `/srv/brain/Shared/projects/i-nex-landing\google-apps-script\Code.gs`
- **Автоматизація Google Sheet:** `/srv/brain/Shared/projects/i-nex-landing\setup-google.py`

## Поточні Tasks

- [x] Створити початкову версію лендінгу
- [x] Налаштувати Google Sheet і Apps Script backend
- [x] Інтегрувати форму реєстрації з Google Sheets
- [x] Замінити Netlify Forms на Google Sheets форму
- [x] Адаптувати дизайн директора під нашу форму
- [x] Задеплоїти на Netlify
- [x] Виправити cache-busting і формат ZIP
- [x] Виправити обробку success-відповіді у формі
- [x] Оновити контакти на +380 (97) 637 37 97 та info@lean-in-progress.consulting
- [ ] Моніторити реєстрації в Google Sheet
- [ ] При необхідності оновити контент/дати перед запуском

## Workstreams / SOPs

- **Деплой на Netlify:** зібрати `deploy-v2/`, створити `i-nex-landing-v2.zip` через Python `zipfile`, завантажити в адмінці Netlify
- **Оновлення контенту:** редагувати `index.html`, перестворити `deploy-v2/` і ZIP, redeploy

## Нотатки

- 2026-06-16: Перша версія лендінгу створена на основі контенту з `задачапромнт.txt`
- 2026-06-16: Отримано відредаговану версію від директора, додано секції Offer та Pricing
- 2026-06-16: Виправлено проблему з ZIP, створеним через PowerShell Compress-Archive (backslashes ламають розпакування на Netlify)
- 2026-06-16: Виправлено JS: форма перевіряє `data.status === 'success'`, бо Apps Script повертає саме це поле
- 2026-06-16: Контакти оновлено на +380 (97) 637 37 97 та info@lean-in-progress.consulting
