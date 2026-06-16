#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
redeploy-webapp.py — створює нову версію Apps Script Web App.

Використовується, коли Web App розгорнуто з порожньої версії
або після оновлення коду Code.gs.
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

BASE_DIR = Path(__file__).parent.resolve()
CLIENT_SECRET_FILE = BASE_DIR / "client_secret_1063159185790-5ftipq1i57ttfq08o5npra3a1v9l6hb7.apps.googleusercontent.com.json"
TOKEN_FILE = BASE_DIR / "token.json"
CONFIG_FILE = BASE_DIR / "google-config.json"
CODE_GS_FILE = BASE_DIR / "google-apps-script" / "Code.gs"

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.projects",
    "https://www.googleapis.com/auth/script.deployments",
    "https://www.googleapis.com/auth/script.processes",
]


def get_credentials():
    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CLIENT_SECRET_FILE), SCOPES
            )
            auth_url, _ = flow.authorization_url(prompt='consent')
            print("🌐 Авторизація Google")
            print(f"   {auth_url}")
            creds = flow.run_local_server(port=0, open_browser=True)

        with open(TOKEN_FILE, "w", encoding="utf-8") as token:
            token.write(creds.to_json())

    return creds


def main():
    if not CONFIG_FILE.exists():
        print("❌ Не знайдено google-config.json. Спочатку запустіть setup-google.py.")
        sys.exit(1)

    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        config = json.load(f)

    script_id = config["scriptId"]

    print("🔐 Авторизація...")
    creds = get_credentials()
    service = build("script", "v1", credentials=creds)

    print("📤 Перевірка коду Code.gs...")
    with open(CODE_GS_FILE, "r", encoding="utf-8") as f:
        code = f.read()

    service.projects().updateContent(
        scriptId=script_id,
        body={
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
        },
    ).execute()
    print("   Код оновлено.")

    print("🔍 Пошук активного Web App deployment...")
    deployments = service.projects().deployments().list(scriptId=script_id).execute()

    if not deployments.get("deployments"):
        print("❌ Web App deployment не знайдено.")
        print("Створіть його вручну: Apps Script → Розгорнути → Нове розгортання → Web app.")
        sys.exit(1)

    web_app_deployment = None
    for dep in deployments["deployments"]:
        if dep.get("deploymentConfig", {}).get("webApp"):
            web_app_deployment = dep
            break

    if not web_app_deployment:
        print("❌ Web App deployment не знайдено.")
        sys.exit(1)

    deployment_id = web_app_deployment["deploymentId"]
    print(f"   Deployment ID: {deployment_id}")

    print("🆕 Створення нової версії...")
    version = service.projects().versions().create(
        scriptId=script_id,
        body={"description": "Оновлена версія з Code.gs"},
    ).execute()
    version_number = version["versionNumber"]
    print(f"   Версія: {version_number}")

    print("🚀 Оновлення Web App deployment...")
    updated = service.projects().deployments().update(
        scriptId=script_id,
        deploymentId=deployment_id,
        body={
            "deploymentConfig": {
                "description": "I-NEX AI registration endpoint",
                "versionNumber": version_number,
                "webApp": {
                    "access": "ANYONE",
                    "executeAs": "USER_DEPLOYING",
                },
            }
        },
    ).execute()

    web_app_url = updated["deploymentConfig"]["webApp"]["url"]

    print("\n" + "=" * 70)
    print("✅ Web App оновлено!")
    print("=" * 70)
    print(f"\nURL: {web_app_url}")
    print("\nПеревір роботу — надішли тестовий POST-запит або відкрий лендінг.")

    config["webAppUrl"] = web_app_url
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
