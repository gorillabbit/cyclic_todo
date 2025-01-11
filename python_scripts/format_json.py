import os
import json
import re
from datetime import datetime, timezone
from pydantic import ValidationError
from importlib import import_module


def convert_seconds_to_datetime(seconds: int, nanoseconds: int) -> str:
    """Convert Firestore seconds and nanoseconds to MySQL datetime format."""
    timestamp = datetime.fromtimestamp(seconds + nanoseconds / 1e9, tz=timezone.utc)
    return timestamp


def camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


def transform_object(obj: dict) -> dict:
    """
    Recursively transform JSON object:
    - Convert keys to snake_case.
    - Convert Firestore timestamps to MySQL datetime.
    """
    transformed = {}
    for key, value in obj.items():
        new_key = camel_to_snake(key)  # Convert key to snake_case

        if isinstance(value, dict) and "_seconds" in value and "_nanoseconds" in value:
            # Convert Firestore timestamp to MySQL datetime
            transformed[new_key] = convert_seconds_to_datetime(
                value["_seconds"], value["_nanoseconds"]
            )
        elif isinstance(value, dict):
            if new_key == "method":
                transformed[new_key] = value["id"]
                continue
            # Recursively transform nested objects
            transformed[new_key] = transform_object(value)
        elif isinstance(value, list):
            # Transform each item in the list
            transformed[new_key] = [
                transform_object(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            transformed[new_key] = value

    return transformed


def filter_and_validate_data(data, model):
    """
    Validate and filter JSON data using Pydantic models.
    """
    print("#### model", model)
    valid_data = []
    for item in data:
        try:
            validated_item = model(**item).dict()  # Validate using Pydantic model
            for column in validated_item:
                if isinstance(validated_item[column], datetime):
                    validated_item[column] = validated_item[column].strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
            valid_data.append(validated_item)  # Convert back to dict
        except ValidationError as e:
            print(f"Validation error: {e}")

    return valid_data


def transform_json_files(input_folder, output_folder, models):
    """
    Transform JSON files:
    - Format data by converting camelCase to snake_case.
    - Validate formatted data using Pydantic models.
    """
    if not os.path.exists(output_folder):
        os.mkdir(output_folder)

    for file_name in os.listdir(input_folder):
        if file_name.endswith(".json"):
            table_name = os.path.splitext(file_name)[0]
            if table_name not in models:
                print(
                    f"Skipping file {file_name} as table {table_name} is not defined in models."
                )
                continue

            model = models[table_name]
            input_file = os.path.join(input_folder, file_name)
            output_file = os.path.join(output_folder, file_name)

            with open(input_file, "r", encoding="utf-8") as infile:
                data = json.load(infile)

            if isinstance(data, list):
                # Transform and validate each item in the list
                transformed_data = [transform_object(item) for item in data]
                valid_data = filter_and_validate_data(transformed_data, model)
            else:
                print(f"Unsupported JSON format in file {file_name}. Expected a list.")
                continue

            with open(output_file, "w", encoding="utf-8") as outfile:
                json.dump(valid_data, outfile, ensure_ascii=False, indent=2)
            print(f"Transformed and saved: {output_file}")


# Main execution
input_folder = "../scripts/data"  # Input folder containing JSON files
output_folder = "../scripts/output"  # Output folder to save transformed JSON files

# Import generated models dynamically from models.py
models_module = import_module("models")  # Ensure `models.py` is in the Python path
models = {
    attr.lower(): getattr(models_module, attr)
    for attr in dir(models_module)
    if not attr.startswith("_") and isinstance(getattr(models_module, attr), type)
}

# Run the transformation
transform_json_files(input_folder, output_folder, models)
