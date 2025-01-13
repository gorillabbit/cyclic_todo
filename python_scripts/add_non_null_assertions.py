import os
import re

# エンティティファイルが格納されているディレクトリのパス
# 現在のスクリプトの絶対パスを取得
current_script_path = os.path.abspath(__file__)

# プロジェクトのルートディレクトリを取得（スクリプトから2階層上にあると仮定）
project_root = os.path.dirname(os.path.dirname(current_script_path))

# エンティティディレクトリへの相対パス
entities_relative_path = (
    "entity/entities"  # プロジェクトルートからの相対パスに置き換えてください
)

# エンティティディレクトリの絶対パスを取得
entities_dir = os.path.join(project_root, entities_relative_path)
# TypeScriptファイルのみを対象とする
ts_files = [f for f in os.listdir(entities_dir) if f.endswith(".ts")]

# プロパティ宣言の正規表現パターン
property_pattern = re.compile(
    r"^(\s*)(public\s+|private\s+|protected\s+)?(\w+)\s*:\s*([^;]+);", re.MULTILINE
)


def is_inside_decorator(content, start_index):
    """
    指定された位置がデコレーターの中にあるかを判定します。
    """
    open_brace = content.rfind("{", 0, start_index)
    close_brace = content.rfind("}", 0, start_index)
    return open_brace > close_brace


def process_file(file_path):
    """
    ファイル内のプロパティ宣言に非nullアサーション演算子を追加し、
    デコレーターのオプション部分はスキップします。
    """
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    updated_lines = []
    for line in content.splitlines():
        match = property_pattern.match(line)
        if match:
            start_index = content.find(line)
            if not is_inside_decorator(content, start_index):
                indentation, visibility, prop_name, prop_type = match.groups()
                visibility = visibility or ""
                # すでに '!' が付いている場合は変更しない
                if not prop_name.endswith("!"):
                    line = f"{indentation}{visibility}{prop_name}!: {prop_type};"
        updated_lines.append(line)

    updated_content = "\n".join(updated_lines)

    # ファイルの内容が変更されている場合のみ書き込み
    if updated_content != content:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(updated_content)
        print(f"{file_path} を更新しました。")
    else:
        print(f"{file_path} に変更はありません。")


# 各ファイルを処理
for ts_file in ts_files:
    process_file(os.path.join(entities_dir, ts_file))
