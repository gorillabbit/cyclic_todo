import re
import logging
from typing import Union

# ログの基本設定
logging.basicConfig(
    level=logging.DEBUG,  # 必要に応じてINFOやWARNINGに変更
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)


def snake_to_camel(snake_str: str) -> str:
    """
    スネークケース（snake_case）の文字列をキャメルケース（CamelCase）に変換します。
    """
    logger.debug("snake_to_camel() を開始します。入力値: %s", snake_str)
    result = "".join(x.capitalize() for x in snake_str.split("_"))
    logger.debug("snake_to_camel() の変換結果: %s", result)
    return result


def parse_sql_file(
    sql_file_path: str,
) -> list[
    dict[str, Union[str, list[dict[str, Union[str, bool]]], list[dict[str, str]]]]
]:
    """
    指定したSQLファイルを解析し、テーブル名・カラム情報・制約などを抽出します。
    日本語やカッコ付き型（VARCHAR(255) 等）にも対応。
    """
    logger.info("parse_sql_file() を開始します。対象SQLファイル: %s", sql_file_path)

    # ファイル読み込み
    try:
        with open(sql_file_path, "r", encoding="utf-8") as file:
            sql_content = file.read()
            logger.debug("SQLファイルの内容を正常に読み込みました。")
    except UnicodeDecodeError:
        logger.warning(
            "UTF-8 での読み込みに失敗しました。デフォルトエンコーディングで再試行します。ファイル: %s",
            sql_file_path,
        )
        with open(sql_file_path, "r") as file:
            sql_content = file.read()
            logger.debug(
                "SQLファイルの内容をデフォルトエンコーディングで読み込みました。"
            )

    # CREATE TABLE の正規表現で該当箇所を抽出
    logger.debug("テーブル定義を正規表現で検索します。")
    tables = re.findall(
        r"CREATE TABLE\s+`?(\w+)`?\s*\((.*?)\)\s*DEFAULT\s+CHARSET.*?;",
        sql_content,
        re.DOTALL | re.IGNORECASE,
    )
    # ↑
    # テーブルの末尾に "DEFAULT CHARSET=utf8mb4 COLLATE=..." がある想定でマッチするように調整。
    # 必要に応じて ";|DEFAULT CHARSET" のようにオアパターンにしても良い。

    logger.info("発見したテーブルの数: %d", len(tables))

    # カラム解析用の関数
    def parse_column(column: str) -> Union[dict[str, Union[str, bool]], None]:
        """
        カラム定義（例: `id VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT ...`）から
        カラム名・型・NULL可否を抽出します。
        """
        logger.debug("カラム定義解析を開始します。対象: %s", column)
        # 例: `isCyclic VARCHAR(50) NULL DEFAULT '...'`
        #     `user_id CHAR(28) NOT NULL`
        #     backtickで囲まれていなくてもOKにするため、以下のように修正。
        #
        # グループ1: カラム名
        # グループ2: 型 (VARCHAR(255), INT, JSON, TEXTなど)
        # グループ3: その他修飾 (NOT NULL, DEFAULT など含む)
        #
        # カラム名に日本語なども含む可能性があるため、 `(\S+)` で取得。
        #
        column_match = re.match(
            r"`?(\S+)`?\s+([A-Za-z]+(?:\(\d+\))?)(.*)", column.strip(), re.IGNORECASE
        )
        if column_match:
            column_name, column_type_raw, modifiers = column_match.groups()
            logger.debug(
                "カラム名: %s, 型(生): %s, 修飾子: %s",
                column_name,
                column_type_raw,
                modifiers,
            )

            # NULL 許可かどうかを判定 (NOT NULL が含まれていれば False)
            allows_null = not re.search(r"NOT\s+NULL", modifiers, re.IGNORECASE)

            logger.debug("NULL許可: %s", allows_null)
            return {
                "name": column_name,
                "type": column_type_raw,  # 後で map_sql_type_to_python で処理
                "nullable": allows_null,
            }
        logger.debug("カラム定義から必要な情報を抽出できませんでした: %s", column)
        return None

    # 制約解析用の関数（外部キーなどを想定）
    def parse_constraint(column: str) -> Union[dict[str, str], None]:
        """
        外部キー制約定義（例: CONSTRAINT `fk_user_role` FOREIGN KEY(`role_id`) REFERENCES `roles`(`id`)）
        から制約情報を抽出します。
        """
        logger.debug("制約定義解析を開始します。対象: %s", column)
        constraint_match = re.match(
            r"CONSTRAINT\s+`?(\w+)`?\s+FOREIGN KEY\s+\(`?(\w+)`?\)\s+REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)",
            column.strip(),
            re.IGNORECASE,
        )
        if constraint_match:
            constraint_name, column_name, referenced_table, referenced_column = (
                constraint_match.groups()
            )
            logger.debug(
                "制約名: %s, 対象カラム: %s, 参照先テーブル: %s, 参照先カラム: %s",
                constraint_name,
                column_name,
                referenced_table,
                referenced_column,
            )
            return {
                "name": constraint_name,
                "column": column_name,
                "referenced_table": referenced_table,
                "referenced_column": referenced_column,
            }
        logger.debug("制約定義ではありませんでした: %s", column)
        return None

    table_definitions = []
    for table_name, columns_block in tables:
        logger.info("テーブルを解析します。テーブル名: %s", table_name)
        column_definitions = []
        constraints = []

        # CREATE TABLE ( ... ) の中身を改行区切りまたはカンマ区切りで分割して解析
        raw_columns = re.split(r",\n|,\s+", columns_block.strip())
        logger.debug("推定カラム定義数: %d", len(raw_columns))

        for column in raw_columns:
            col_str = column.strip().rstrip(",")  # 末尾にカンマがあれば除去
            logger.debug("カラム/制約解析対象文字列: %s", col_str)

            if constraint := parse_constraint(col_str):
                logger.debug("外部キー制約を検出しました。")
                constraints.append(constraint)
            elif column_def := parse_column(col_str):
                logger.debug("カラム定義を追加します。")
                column_definitions.append(column_def)
            else:
                logger.debug(
                    "カラムまたは制約の形式に合致しませんでした。スキップします。"
                )

        # テーブル定義としてまとめる
        logger.info(
            "テーブル解析が完了しました。カラム数: %d, 制約数: %d",
            len(column_definitions),
            len(constraints),
        )
        table_definitions.append(
            {
                "table_name": table_name,
                "columns": column_definitions,
                "constraints": constraints,
            }
        )

    logger.info(
        "parse_sql_file() 完了。解析したテーブル定義数: %d", len(table_definitions)
    )
    return table_definitions


def map_sql_type_to_python(sql_type: str, nullable: bool) -> str:
    """
    SQLタイプ（CHAR(20), VARCHAR(255) など）を Python（Pydantic）用のタイプアノテーションに変換します。
    NULL許可の場合はOptionalにします。
    """
    logger.debug(
        "map_sql_type_to_python() を開始します。SQLタイプ: %s, NULL許可: %s",
        sql_type,
        nullable,
    )

    # カッコが付いている場合があるので、ベースタイプを抽出
    # 例) VARCHAR(255) -> varchar
    #     CHAR(20)     -> char
    #     DATETIME     -> datetime
    #     JSON         -> json
    base_match = re.match(r"([a-z]+)", sql_type.lower())
    if base_match:
        base_type = base_match.group(1)
    else:
        base_type = sql_type.lower()
    logger.debug("抽出したベースタイプ: %s", base_type)

    type_mapping = {
        "int": "int",
        "varchar": "str",
        "char": "str",
        "text": "str",
        "boolean": "bool",
        "bool": "bool",
        "date": "datetime.date",
        "datetime": "datetime.datetime",
        "json": "Union[list[str], str]",
    }

    python_type = type_mapping.get(base_type, "str")
    logger.debug("初期マッピング結果: %s", python_type)

    if nullable:
        result_type = f"Optional[{python_type}] = None"
        logger.debug("NULL許可のため、最終的なアノテーション: %s", result_type)
        return result_type
    else:
        logger.debug("NULL非許可のため、最終的なアノテーション: %s", python_type)
        return python_type


def generate_pydantic_models(
    table_definitions: list[
        dict[str, Union[str, list[dict[str, Union[str, bool]]], list[dict[str, str]]]]
    ],
) -> str:
    """
    解析済みのテーブル定義からPydanticモデルコードを生成します。
    """
    logger.info("generate_pydantic_models() を開始します。")
    model_definitions = []

    for table in table_definitions:
        table_name = table["table_name"]
        columns = table["columns"]
        logger.info("Pydanticモデルを生成中のテーブル: %s", table_name)

        # テーブル名をキャメルケースに
        class_name = snake_to_camel(table_name)
        logger.debug("クラス名に変換: %s", class_name)

        model = [f"class {class_name}(BaseModel):"]
        if not columns:
            logger.debug("カラムが存在しないため、pass を入れたクラス定義とします。")
            model.append("    pass")
        else:
            for column in columns:
                col_name = column["name"]
                sql_type = column["type"]
                nullable = column["nullable"]
                logger.debug(
                    "カラムから型定義を作成します。カラム名: %s, SQLタイプ: %s, NULL許可: %s",
                    col_name,
                    sql_type,
                    nullable,
                )
                python_type = map_sql_type_to_python(sql_type, nullable)
                # カラム名がPythonの識別子として微妙な場合もあるが、ここではそのまま出力
                model.append(f"    {col_name}: {python_type}")

        model_definitions.append("\n".join(model))

    logger.info("Pydanticモデルの生成が完了しました。")
    return "\n\n".join(model_definitions)


# メイン処理
if __name__ == "__main__":
    logger.info("スクリプトのメイン処理を開始します。")
    sql_file_path = "./createAuroraTables.sql"  # SQL定義ファイルのパス

    logger.info("SQLファイルの解析を開始します。")
    table_definitions = parse_sql_file(sql_file_path)

    logger.info("Pydanticモデルのコード生成を開始します。")
    models = generate_pydantic_models(table_definitions)

    output_file_name = "models.py"
    logger.info(
        "生成したモデルをファイルに書き込みます。ファイル名: %s", output_file_name
    )
    with open(output_file_name, "w", encoding="utf-8") as output_file:
        output_file.write("import datetime\n")
        output_file.write("from pydantic import BaseModel\n")
        output_file.write("from typing import Optional, Any, Union\n")
        output_file.write("\n\n")
        output_file.write(models)

    logger.info("スクリプトのメイン処理が完了しました。")
