# I-NEX AI Landing Page

Лендінгова сторінка для навчальної програми I-NEX — впровадження AI в управління бізнесом для CEO, COO та керівників команд.

## Структура проєкту

```
i-nex-landing/
├── index.html              # Головна сторінка лендінгу
├── css/
│   └── styles.css          # Стилі
├── js/
│   └── main.js             # Логіка форми, меню, скролу
├── netlify.toml            # Конфігурація Netlify
├── google-apps-script/
│   ├── Code.gs             # Бекенд для Google Sheets
│   ├── test-form.html      # Тестова форма
│   └── SETUP.md            # Інструкція з налаштування Google Sheets
└── README.md               # Цей файл
```

## Швидкий старт

### 1. Підключіть Google Sheets

Перейдіть до папки `google-apps-script/` та виконайте інструкції з `SETUP.md`:

1. Створіть Google Sheet.
2. Вставте код `Code.gs` в Apps Script.
3. Розгорніть Web App.
4. Скопіюйте URL Web App.

### 2. Вставте URL Web App у лендінг

Відкрийте `js/main.js` і замініть:

```js
const SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_ІДЕНТИФІКАТОР/exec';
```

на ваш реальний URL.

### 3. Задеплойте на Netlify

#### Варіант A: Drag & Drop

1. Перейдіть на [app.netlify.com](https://app.netlify.com).
2. Натисніть **Add new site → Deploy manually**.
3. Перетягніть папку `i-nex-landing/` у вікно.
4. Дочекайтеся деплою.

#### Варіант B: Git

1. Завантажте папку `i-nex-landing/` у GitHub-репозиторій.
2. У Netlify оберіть **Add new site → Import an existing project**.
3. Підключіть репозиторій.
4. Build command: залиште порожнім.
5. Publish directory: `/` (корінь репозиторія, якщо це окремий репо).

### 4. Підключіть домен (опціонально)

У налаштуваннях сайту Netlify перейдіть до **Domain management** і додайте свій домен або використовуйте безкоштовний `*.netlify.app`.

## Тестування форми

1. Відкрийте задеплоєний сайт.
2. Заповніть форму реєстрації.
3. Натисніть **Зареєструватися**.
4. Перевірте Google Sheet — новий рядок має з’явитися в аркуші `Реєстрації`.

Якщо щось не працює, відкрийте `google-apps-script/test-form.html` у браузері та протестуйте Web App окремо.

## Бренд

- **Логотип:** i-nex
- **Слоган:** SYSTEM OVER CHAOS
- **Кольори:** Deep Navy `#0A0E1A`, Power Orange `#FF6B00`
- **Шрифти:** Poppins, Montserrat, Lato, Inter

## Контакти

Марія: +380 67 259 50 15, mariia.halai@gmail.com
