#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
setup-google.py — автоматичне створення Google Sheet та Apps Script для I-NEX landing.

Вимоги:
    pip install google-auth-oauthlib google-api-python-client google-auth-httplib2

Використання:
    python setup-google.py

Після запуску відкриється браузер для авторизації Google. Потім скрипт створить:
    - Google Sheet "I-NEX AI — Реєстрації"
    - Apps Script project з кодом форми

Далі потрібно вручну розгорнути Web App у редакторі Apps Script.
"""

import json
import os
import sys
from pathlib import Path

# Windows-консоль: примусово UTF-8
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ============================================================
# Configuration
# ============================================================
BASE_DIR = Path(__file__).parent.resolve()
CLIENT_SECRET_FILE = BASE_DIR / "client_secret_1063159185790-5ftipq1i57ttfq08o5npra3a1v9l6hb7.apps.googleusercontent.com.json"
TOKEN_FILE = BASE_DIR / "token.json"
CODE_GS_FILE = BASE_DIR / "google-apps-script" / "Code.gs"

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.projects",
    "https://www.googleapis.com/auth/script.deployments",
    "https://www.googleapis.com/auth/script.processes",
]

SHEET_TITLE = "I-NEX AI — Реєстрації"
SCRIPT_TITLE = "I-NEX AI Registration Backend"


def get_credentials():
    """Отримує або створює OAuth credentials."""
    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CLIENT_SECRET_FILE.exists():
                print(f"❌ Не знайдено {CLIENT_SECRET_FILE}")
                print("Завантажте client_secret.json з Google Cloud Console у папку проєкту.")
                sys.exit(1)

            flow = InstalledAppFlow.from_client_secrets_file(
                str(CLIENT_SECRET_FILE), SCOPES
            )
            auth_url, _ = flow.authorization_url(prompt='consent')
            print("🌐 Авторизація Google")
            print("   Якщо браузер не відкрився автоматично, перейди за цим посиланням:")
            print(f"   {auth_url}")
            print("   Після авторизації повернись сюди.")
            creds = flow.run_local_server(port=0, open_browser=True)

        # Зберігаємо token для наступних запусків
        with open(TOKEN_FILE, "w", encoding="utf-8") as token:
            token.write(creds.to_json())

    return creds


def create_sheet(service):
    """Створює Google Sheet для реєстрацій."""
    spreadsheet = {
        "properties": {"title": SHEET_TITLE},
        "sheets": [
            {
                "properties": {
                    "title": "Реєстрації",
                    "gridProperties": {"rowCount": 1000, "columnCount": 8},
                }
            }
        ],
    }

    result = service.spreadsheets().create(body=spreadsheet).execute()
    return result["spreadsheetId"], result["spreadsheetUrl"]


def init_sheet_headers(sheets_service, spreadsheet_id):
    """Заповнює заголовки колонок у першому рядку."""
    # Отримуємо sheetId аркуша "Реєстрації"
    spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    sheet_id = None
    for sheet in spreadsheet.get("sheets", []):
        if sheet["properties"]["title"] == "Реєстрації":
            sheet_id = sheet["properties"]["sheetId"]
            break
    if sheet_id is None:
        raise RuntimeError("Аркуш 'Реєстрації' не знайдено")

    headers = [
        "Час реєстрації",
        "Прізвище та ім'я",
        "Назва компанії",
        "Посада",
        "Email",
        "Номер телефону",
        "Сфера діяльності компанії",
        "Участь з колегою",
    ]

    body = {
        "values": [headers]
    }

    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="Реєстрації!A1:H1",
        valueInputOption="RAW",
        body=body,
    ).execute()

    # Робимо заголовки жирними і заморожуємо рядок
    requests = [
        {
            "repeatCell": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "endRowIndex": 1,
                    "startColumnIndex": 0,
                    "endColumnIndex": 8,
                },
                "cell": {
                    "userEnteredFormat": {
                        "textFormat": {"bold": True},
                        "backgroundColor": {"red": 0.04, "green": 0.05, "blue": 0.10},
                        "horizontalAlignment": "LEFT",
                    }
                },
                "fields": "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)",
            }
        },
        {"updateSheetProperties": {"properties": {"sheetId": sheet_id, "gridProperties": {"frozenRowCount": 1}}, "fields": "gridProperties.frozenRowCount"}},
    ]

    sheets_service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id, body={"requests": requests}
    ).execute()


def create_apps_script_project(script_service, spreadsheet_id):
    """Створює Apps Script project, прив'язаний до Google Sheet."""
    request = {
        "title": SCRIPT_TITLE,
        "parentId": spreadsheet_id,
    }
    response = script_service.projects().create(body=request).execute()
    return response["scriptId"]


def upload_script_code(script_service, script_id, code):
    """Завантажує Code.gs в Apps Script project."""
    content = {
        "files": [
            {
                "name": "appsscript",
                "type": "JSON",
                "source": json.dumps(
                    {
                        "timeZone": "Europe/Kiev",
                        "exceptionLogging": "STACKDRIVER",
                        "runtimeVersion": "V8",
                    },
                    indent=2,
                ),
            },
            {
                "name": "Code",
                "type": "SERVER_JS",
                "source": code,
            },
        ]
    }

    script_service.projects().updateContent(
        scriptId=script_id, body=content
    ).execute()


def main():
    print("🔐 Авторизація в Google...")
    creds = get_credentials()

    drive_service = build("drive", "v3", credentials=creds)
    sheets_service = build("sheets", "v4", credentials=creds)
    script_service = build("script", "v1", credentials=creds)

    print("📄 Створення Google Sheet...")
    spreadsheet_id, sheet_url = create_sheet(sheets_service)
    print(f"   Sheet URL: {sheet_url}")

    print("📝 Ініціалізація заголовків...")
    init_sheet_headers(sheets_service, spreadsheet_id)

    print("⚙️ Створення Apps Script project...")
    script_id = create_apps_script_project(script_service, spreadsheet_id)
    script_editor_url = f"https://script.google.com/home/projects/{script_id}/edit"
    print(f"   Script Editor: {script_editor_url}")

    print("📤 Завантаження Code.gs...")
    if not CODE_GS_FILE.exists():
        print(f"❌ Не знайдено {CODE_GS_FILE}")
        sys.exit(1)

    with open(CODE_GS_FILE, "r", encoding="utf-8") as f:
        code = f.read()

    upload_script_code(script_service, script_id, code)

    print("\n" + "=" * 70)
    print("✅ Готово! Залишився останній крок — розгорнути Web App.")
    print("=" * 70)
    print(f"\n1. Google Sheet:    {sheet_url}")
    print(f"2. Apps Script:     {script_editor_url}")
    print("\n3. Відкрий Apps Script і натисни:")
    print("   Розгорнути → Нове розгортання → Тип: Веб-застосунок")
    print("   Виконувати як: Мене")
    print("   Доступ: Будь-хто")
    print("\n4. Скопіюй URL веб-застосунку і дай мені.")
    print("   Я вставлю його в js/main.js\n")

    # Зберігаємо script_id для майбутнього використання
    config = {
        "spreadsheetId": spreadsheet_id,
        "spreadsheetUrl": sheet_url,
        "scriptId": script_id,
        "scriptEditorUrl": script_editor_url,
    }
    config_file = BASE_DIR / "google-config.json"
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    print(f"💾 Конфіг збережено: {config_file}")


if __name__ == "__main__":
    main()
