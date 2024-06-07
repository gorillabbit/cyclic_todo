#!/bin/bash

# テストプロジェクトID
TEST_PROJECT_ID="todolist-37a07"
# 本番プロジェクトID
PROD_PROJECT_ID="cyclictodo"

# インデックスのエクスポート
firebase firestore:indexes --project $TEST_PROJECT_ID > firestore.indexes.utf16.json

# UTF-16からUTF-8への変換

iconv -f UTF-16LE -t utf8 firestore.indexes.utf16.json > firestore.indexes.json -c
cat firestore.indexes.json

# 本番環境にインポート
firebase firestore:indexes --project $PROD_PROJECT_ID firestore.indexes.json
