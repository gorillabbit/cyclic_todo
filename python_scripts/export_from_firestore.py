#!/usr/bin/env python3
import argparse
import sys
import os
import json
from datetime import datetime
from google.cloud import firestore


# ■★★★デバッグ用：日時やその他の非標準型を文字列に変換する関数★★★
def default_json_serializer(obj):
    if isinstance(obj, datetime):
        # デバッグのため「datetimeがあったときにprint」する
        print(f"[DEBUG] Converting datetime to isoformat: {obj}")
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


def export_collection(db: firestore.Client, collection_name: str):
    print(f"[DEBUG] Exporting collection: {collection_name}")
    col_ref = db.collection(collection_name)

    print("[DEBUG] Querying Firestore...")
    docs = col_ref.stream()
    print("[DEBUG] Firestore query completed. Processing documents...")

    data = []
    count = 0
    for doc in docs:
        record = {"id": doc.id}
        record.update(doc.to_dict())

        # デバッグ用にドキュメントIDと簡単な情報を表示（必要に応じて省略可）
        print(f"[DEBUG] Doc ID: {doc.id}, fields: {list(record.keys())}")

        data.append(record)
        count += 1

    print(f"[DEBUG] Total documents in '{collection_name}': {count}")

    os.makedirs("data", exist_ok=True)
    output_path = os.path.join("data", f"{collection_name}.json")

    print(f"[DEBUG] Writing JSON to: {output_path}")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(
            data, f, indent=2, ensure_ascii=False, default=default_json_serializer
        )

    print(f"[DEBUG] Export of {collection_name} complete. (count={count})")


def export_collections(db: firestore.Client, collection_names: list[str]):
    print(f"[DEBUG] export_collections received: {collection_names}")
    for name in collection_names:
        export_collection(db, name)


def get_firestore_client(env: str):
    # ■★★★ここでサービスアカウントを読み込む★★★
    if env == "test":
        cred_path = "service_account_test.json"
        print("[DEBUG] Using TEST environment.")
    else:
        cred_path = "service_account_prd.json"
        print("[DEBUG] Using PRODUCTION environment.")

    print(f"[DEBUG] Loading credentials from {cred_path}")
    return firestore.Client.from_service_account_json(cred_path)


ALL_COLLECTIONS = [
    "tasks",
    "logs",
    "logsCompleteLogs",
    "Accounts",
    "Purchases",
    "PurchaseTemplates",
    "Assets",
    "PurchaseSchedules",
    "Methods",
    "TransferTemplates",
    "Tabs",
]


def main():
    # ■★★★コマンドライン引数のパース★★★
    parser = argparse.ArgumentParser(
        description="Export Firestore collections to JSON files."
    )
    parser.add_argument(
        "--env",
        choices=["prod", "test"],
        default="prod",
        help="Environment: prod (default) or test",
    )
    parser.add_argument("--all", action="store_true", help="Export all collections.")
    parser.add_argument(
        "collections",
        nargs="*",
        help="Specific collection names to export (ignored if --all is used).",
    )

    args = parser.parse_args()

    print(f"[DEBUG] Parsed args: {args}")

    # ■★★★Firestoreクライアント初期化★★★
    db = get_firestore_client(args.env)

    # ■★★★export_collections呼び出し★★★
    if args.all:
        print("[DEBUG] --all is specified. Exporting ALL collections...")
        export_collections(db, ALL_COLLECTIONS)
    else:
        if not args.collections:
            print("[DEBUG] No collections specified and --all not used.")
            parser.print_help()
            sys.exit(1)

        print("[DEBUG] Exporting only specified collections...")
        export_collections(db, args.collections)

    print("[DEBUG] Script completed successfully.")


if __name__ == "__main__":
    main()
