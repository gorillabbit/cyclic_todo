import re


def parse_sql_file(sql_file_path: str) -> list[dict]:
    """
    Parse a SQL file to extract table names, columns, and their types, including constraints.
    """
    with open(sql_file_path, 'r') as file:
        sql_content = file.read()

    print(sql_content)

    # Regex to match CREATE TABLE statements
    tables = re.findall(
        r"CREATE TABLE\s+(\w+)\s*\((.*?)\);",
        sql_content,
        re.DOTALL | re.IGNORECASE
    )
    
    table_definitions = []
    for table_name, columns in tables:
        column_definitions = []
        constraints = []
        for column in columns.split(","):
            column = column.strip()

            # Match constraints (e.g., FOREIGN KEY)
            constraint_match = re.match(
                r"CONSTRAINT\s+(\w+)\s+FOREIGN KEY\s+\((\w+)\)\s+REFERENCES\s+(\w+)\s*\((\w+)\)",
                column,
                re.IGNORECASE
            )
            if constraint_match:
                constraint_name, column_name, referenced_table, referenced_column = constraint_match.groups()
                constraints.append({
                    "name": constraint_name,
                    "column": column_name,
                    "referenced_table": referenced_table,
                    "referenced_column": referenced_column
                })
                continue

            # Match columns
            column_match = re.match(
                r"(\w+)\s+(\w+)(?:\s+NULL|\s+NOT\s+NULL)?", column, re.IGNORECASE
            )
            if column_match:
                print(column_match)
                column_name, column_type, *_ = column_match.groups()
                allows_null = "NOT NULL" not in column.upper()
                column_definitions.append({"name": column_name, "type": column_type,  "nullable": allows_null,})
                continue

        table_definitions.append({
            "table_name": table_name,
            "columns": column_definitions,
            "constraints": constraints
        })
    
    return table_definitions


def generate_pydantic_models(table_definitions: list[dict]) -> str:
    """
    Generate Pydantic models from parsed table definitions.
    """
    model_definitions = []
    for table in table_definitions:
        model = [f"class {table['table_name'].capitalize()}(BaseModel):"]
        for column in table["columns"]:
            python_type = map_sql_type_to_python(column["type"], column["nullable"])
            model.append(f"    {column['name']}: {python_type}")
        model_definitions.append("\n".join(model))

    return "\n\n".join(model_definitions)


def map_sql_type_to_python(sql_type: str, nullable: bool) -> str:
    """
    Map SQL types to Python types, considering nullability.
    """
    type_mapping = {
        "int": "int",
        "varchar": "str",
        "text": "str",
        "boolean": "bool",
        "date": "datetime.date",
        "datetime": "datetime.datetime",
        # Add more mappings as needed
    }
    python_type = type_mapping.get(sql_type.lower(), "str")
    if nullable:
        return f"{python_type} | None"
    return python_type


# Main execution
sql_file_path = "../scripts/createAuroraTables.sql"  # SQL定義ファイルを指定
table_definitions = parse_sql_file(sql_file_path)
models = generate_pydantic_models(table_definitions)

# models.py ファイルに出力
with open("models.py", "w") as output_file:
    output_file.write("from pydantic import BaseModel\n")
    output_file.write("import datetime\n\n")
    output_file.write(models)

