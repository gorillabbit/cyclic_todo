import os
import json
import re
from datetime import datetime, timezone
from pydantic import ValidationError
from importlib import import_module


def snake_to_camel(snake_str: str) -> str:
    """Convert a snake_case string to CamelCase."""
    return "".join(word.capitalize() for word in snake_str.split("_"))


def camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name).lower()


def convert_seconds_to_datetime(seconds: int, nanoseconds: int) -> str:
    """Convert Firestore seconds and nanoseconds to MySQL datetime format."""
    return datetime.fromtimestamp(
        seconds + nanoseconds / 1e9, tz=timezone.utc
    ).strftime("%Y-%m-%d %H:%M:%S")


def transform_object(obj: dict) -> dict:
    """Recursively transform JSON object by:
    - Converting keys to snake_case.
    - Converting Firestore timestamps to MySQL datetime.
    - Replacing 'method', 'to_method', and 'from_method' with their 'id' values.
    """

    def transform_value(key, value):
        if (
            key in {"method", "to_method", "from_method"}
            and isinstance(value, dict)
            and "id" in value
        ):
            return value["id"]
        if isinstance(value, dict) and "_seconds" in value and "_nanoseconds" in value:
            return convert_seconds_to_datetime(value["_seconds"], value["_nanoseconds"])
        if isinstance(value, dict):
            return transform_object(value)
        if isinstance(value, list):
            if key in {"receiveRequest", "linkedAccounts", "sharedAccounts"}:
                return [item["id"] for item in value] if value else None
            return [transform_value(None, item) for item in value] if value else None
        return value

    return {camel_to_snake(k): transform_value(k, v) for k, v in obj.items()}


def filter_and_validate_data(data, model):
    """Validate and filter JSON data using Pydantic models."""
    valid_data = []
    for item in data:
        try:
            validated_item = model(**item).model_dump()
            valid_data.append(
                {
                    k: (
                        v.strftime("%Y-%m-%d %H:%M:%S")
                        if isinstance(v, datetime)
                        else v
                    )
                    for k, v in validated_item.items()
                }
            )
        except ValidationError as e:
            print(f"Validation error: {e}")
    return valid_data


def process_file(file_name, input_folder, output_folder, model):
    """Process a single JSON file: transform, validate, and save."""
    input_file = os.path.join(input_folder, file_name)
    output_file = os.path.join(output_folder, file_name)

    with open(input_file, "r", encoding="utf-8") as in_file:
        data = json.load(in_file)

    if not isinstance(data, list):
        print(f"処理スキップ: {file_name} Unsupported format (expected list).")
        return

    transformed_data = [transform_object(item) for item in data]
    valid_data = filter_and_validate_data(transformed_data, model)

    with open(output_file, "w", encoding="utf-8") as outfile:
        json.dump(valid_data, outfile, ensure_ascii=False, indent=2)
    print(f"処理完了: {output_file}")


def transform_json_files(input_folder, output_folder, models):
    """Transform JSON files in a folder using Pydantic models."""
    os.makedirs(output_folder, exist_ok=True)

    for file_name in filter(lambda f: f.endswith(".json"), os.listdir(input_folder)):
        table_name = os.path.splitext(file_name)[0]
        model = models.get(table_name)

        if not model:
            print(f"処理スキップ: {file_name}: No model found for table {table_name}.")
            continue

        process_file(file_name, input_folder, output_folder, model)


# Main execution
if __name__ == "__main__":
    input_folder = "./data"  # Input folder containing JSON files
    output_folder = "./output"  # Output folder to save transformed JSON files

    # Dynamically import models from models.py
    models_module = import_module("models")
    models = {
        attr: getattr(models_module, attr)
        for attr in dir(models_module)
        if not attr.startswith("_") and isinstance(getattr(models_module, attr), type)
    }

    transform_json_files(input_folder, output_folder, models)
