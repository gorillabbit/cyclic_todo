#!/bin/bash

# .envファイルのパスを指定
ENV_FILE=".env"

# .envファイルが存在するか確認
if [[ ! -f $ENV_FILE ]]; then
  echo "Error: $ENV_FILE not found."
  exit 1
fi

# GitHubリポジトリ名を設定 (例: username/repository)
REPO="gorillabbit/cyclic_todo"

# .envファイルを読み込んでシークレットを設定
while IFS='=' read -r KEY VALUE; do
  # コメント行や空行をスキップ
  [[ $KEY == \#* || -z $KEY ]] && continue

  # シークレットをGitHubに設定
  echo "Setting $KEY in $REPO..."
  gh secret set "$KEY" -b "$VALUE" -R "$REPO"
done < "$ENV_FILE"

echo "All secrets have been set successfully."
