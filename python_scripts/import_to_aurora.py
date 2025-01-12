import pymysql
import json
from pathlib import Path
import re
import os
from dotenv import load_dotenv

load_dotenv()


def get_database_connection():
    """Create and return a MySQL database connection."""
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        autocommit=False,
    )


def execute_sql_file(file_path, connection):
    """Execute SQL statements from a file."""
    if not file_path.exists():
        print(f"SQL file not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        sql_statements = file.read()

    with connection.cursor() as cursor:
        for statement in sql_statements.split(";"):
            statement = statement.strip()
            if statement:
                cursor.execute(statement)
    print(f"Executed SQL statements from {file_path}")


def extract_table_order(sql_file_path):
    """Extract table names in the order they are created in the SQL file."""
    if not sql_file_path.exists():
        print(f"SQL file not found: {sql_file_path}")
        return []

    with open(sql_file_path, "r", encoding="utf-8") as file:
        sql_content = file.read()

    # Regex to find CREATE TABLE statements and extract table names
    table_names = re.findall(r"CREATE TABLE\s+`?(\w+)`?", sql_content, re.IGNORECASE)
    print(f"Table order extracted from SQL: {table_names}")
    return table_names


def process_json_value(value):
    """Process JSON value based on its type for MySQL insertion."""
    if isinstance(value, list):
        # JSON_ARRAY を正しく構築
        return f"JSON_ARRAY({', '.join(json.dumps(v) for v in value)})"
    elif value is None:
        return "NULL"  # None を NULL に変換
    elif isinstance(value, bool):
        return "TRUE" if value else "FALSE"  # Boolean を TRUE/FALSE に変換
    elif isinstance(value, int):
        return str(value)  # int をそのまま文字列に変換
    elif isinstance(value, str):
        # 文字列を適切にエスケープ
        return json.dumps(value)
    return value


def import_data(collection_name, connection):
    """Import JSON data into the specified MySQL table."""
    file_path = (
        Path(__file__).resolve().parents[1] / f"scripts/output/{collection_name}.json"
    )
    if not file_path.exists():
        print(f"File not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    with connection.cursor() as cursor:
        for item in data:
            try:
                columns = ", ".join(item.keys())
                values = [process_json_value(v) for v in item.values()]

                # SQL 文を生成
                placeholders = ", ".join(values)
                sql = (
                    f"INSERT INTO {collection_name} ({columns}) VALUES ({placeholders})"
                )
                print(f"# sql: {sql}")
                cursor.execute(sql)
            except Exception as e:
                print(f"Failed to import {collection_name}: {e}")

        connection.commit()
        print(f"Imported {collection_name} to Aurora.")


def import_all_collections():
    """Create tables and import data for all specified collections."""
    connection = get_database_connection()
    try:
        # Execute the SQL file to create tables
        sql_file_path = Path(__file__).resolve().parent / "createAuroraTables.sql"
        execute_sql_file(sql_file_path, connection)

        collections = extract_table_order(sql_file_path)
        if not collections:
            print("No collections found to import.")
            return

        for collection_name in collections:
            import_data(collection_name, connection)
    finally:
        connection.close()


if __name__ == "__main__":
    try:
        import_all_collections()
    except Exception as e:
        print(f"Error during import: {e}")
