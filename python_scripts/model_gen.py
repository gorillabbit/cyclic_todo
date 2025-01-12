import re
from typing import Union


def snake_to_camel(snake_str: str) -> str:
    """Convert a snake_case string to CamelCase."""
    return "".join(x.capitalize() for x in snake_str.split("_"))


def parse_sql_file(
    sql_file_path: str,
) -> list[
    dict[str, Union[str, list[dict[str, Union[str, bool]]], list[dict[str, str]]]]
]:
    """
    Parse a SQL file to extract table names, columns, and their types, including constraints.
    """
    with open(sql_file_path, "r") as file:
        sql_content = file.read()

    tables = re.findall(
        r"CREATE TABLE\s+`?(\w+)`?\s*\((.*?)\);", sql_content, re.DOTALL | re.IGNORECASE
    )

    def parse_column(column: str) -> Union[dict[str, Union[str, bool]], None]:
        column_match = re.match(
            r"`?(\w+)`?\s+(\w+)(?:\s+NULL|\s+NOT\s+NULL)?", column, re.IGNORECASE
        )
        if column_match:
            column_name, column_type = column_match.groups()
            allows_null = "NOT NULL" not in column.upper()
            return {"name": column_name, "type": column_type, "nullable": allows_null}
        return None

    def parse_constraint(column: str) -> Union[dict[str, str], None]:
        constraint_match = re.match(
            r"CONSTRAINT\s+`?(\w+)`?\s+FOREIGN KEY\s+\(`?(\w+)`?\)\s+REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)",
            column,
            re.IGNORECASE,
        )
        if constraint_match:
            constraint_name, column_name, referenced_table, referenced_column = (
                constraint_match.groups()
            )
            return {
                "name": constraint_name,
                "column": column_name,
                "referenced_table": referenced_table,
                "referenced_column": referenced_column,
            }
        return None

    table_definitions = []
    for table_name, columns in tables:
        column_definitions = []
        constraints = []
        for column in map(str.strip, columns.split(",")):
            if constraint := parse_constraint(column):
                constraints.append(constraint)
            elif column_def := parse_column(column):
                column_definitions.append(column_def)

        table_definitions.append(
            {
                "table_name": table_name,
                "columns": column_definitions,
                "constraints": constraints,
            }
        )

    return table_definitions


def map_sql_type_to_python(sql_type: str, nullable: bool) -> str:
    """Map SQL types to Python types, considering nullability."""
    type_mapping = {
        "int": "int",
        "varchar": "str",
        "text": "str",
        "boolean": "bool",
        "date": "datetime.date",
        "datetime": "datetime.datetime",
        "json": "Union[list[str], str]",
    }
    python_type = type_mapping.get(sql_type.lower(), "str")
    return f"Optional[{python_type}] = None" if nullable else python_type


def generate_pydantic_models(
    table_definitions: list[
        dict[str, Union[str, list[dict[str, Union[str, bool]]], list[dict[str, str]]]]
    ],
) -> str:
    """Generate Pydantic models from parsed table definitions."""
    model_definitions = []
    for table in table_definitions:
        class_name = snake_to_camel(table["table_name"])
        model = [f"class {class_name}(BaseModel):"]
        if not table["columns"]:
            model.append("    pass")
        else:
            for column in table["columns"]:
                python_type = map_sql_type_to_python(column["type"], column["nullable"])
                model.append(f"    {column['name']}: {python_type}")
        model_definitions.append("\n".join(model))

    return "\n\n".join(model_definitions)


# Main execution
if __name__ == "__main__":
    sql_file_path = "./createAuroraTables.sql"  # SQL definition file path
    table_definitions = parse_sql_file(sql_file_path)
    models = generate_pydantic_models(table_definitions)

    with open("models.py", "w") as output_file:
        output_file.write("import datetime\n")
        output_file.write("from pydantic import BaseModel\n")
        output_file.write("from typing import Optional, Any, Union\n")
        output_file.write("\n\n")
        output_file.write(models)
