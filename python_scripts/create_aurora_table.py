#!/usr/bin/env python3
import argparse
import os
import sys
from pathlib import Path
import pymysql
from dotenv import load_dotenv

load_dotenv()  # .env を読み込む


def get_connection(env: str):
    """
    env='test' ならテスト用、env='prod' なら本番用の
    環境変数を使って接続情報を取得。
    ※ DB名をここで設定しても、あとで CREATE/DROP するために
      一旦 'mysql' や空のDB名に接続するのもあり。
    """
    host = os.getenv("MYSQL_HOST") or "localhost"
    user = os.getenv("MYSQL_USER") or "root"
    password = os.getenv("MYSQL_PASSWORD") or ""
    if env == "test":
        # テスト用DB名 (例: cyclictodo_test)
        db_name = os.getenv("MYSQL_DATABASE_TEST") or "cyclictodo_test"
        print("[INFO] Connecting to TEST database (will create/drop).")
    else:
        # 本番用DB名 (例: cyclictodo)
        db_name = os.getenv("MYSQL_DATABASE") or "cyclictodo"
        print("[INFO] Connecting to PRODUCTION database (will create/drop).")

    print(f"[DEBUG] host={host}, user={user}, db={db_name}")

    # DBを DROP するために、まだ存在しない場合は接続に失敗する可能性があるので、
    # まずは 'mysql' や 'information_schema' 等の既存データベースに接続しておく
    # ※ すでにDBが存在しているなら、直接 db_name に接続してもOKです
    conn = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database="mysql",  # 便宜上「mysql」DBに接続
        autocommit=False,
        charset="utf8mb4",
    )

    return conn, db_name


def execute_sql_file_with_db_replace(sql_file_path: Path, connection, db_name: str):
    """SQLファイルを読み込み、{DB_NAME} を指定の db_name に置換して一文ずつ実行。"""
    if not sql_file_path.exists():
        print(f"SQL file not found: {sql_file_path}")
        sys.exit(1)

    with open(sql_file_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    # ▼ {DB_NAME} を実際のDB名に置換
    sql_content = sql_content.replace("{DB_NAME}", db_name)

    # ";" で区切って1文ずつ実行する
    statements = sql_content.split(";")

    with connection.cursor() as cursor:
        for stmt in statements:
            stmt = stmt.strip()
            if stmt:
                # デバッグ用に先頭80文字だけ出力
                print(f"[SQL] {stmt[:80]}...")
                cursor.execute(stmt)

    connection.commit()
    print(f"[INFO] Executed SQL statements from {sql_file_path} with DB={db_name}")


def main():
    parser = argparse.ArgumentParser(
        description="Execute createAuroraTables.sql with DB name replaced for test/prod."
    )
    parser.add_argument(
        "--env",
        choices=["test", "prod"],
        default="test",
        help="Which environment to use (default: test).",
    )
    args = parser.parse_args()

    # 接続取得 (まずは 'mysql' DBなどに接続)
    connection, db_name = get_connection(args.env)

    try:
        # SQLファイル (同ディレクトリにある createAuroraTables.sql と仮定)
        sql_file = Path(__file__).parent / "createAuroraTables.sql"

        # {DB_NAME} を置換しつつ実行
        execute_sql_file_with_db_replace(sql_file, connection, db_name)

    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)
    finally:
        connection.close()
        print("[INFO] Connection closed.")


if __name__ == "__main__":
    main()
