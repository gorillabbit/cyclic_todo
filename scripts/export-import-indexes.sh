#!/bin/bash

# テストプロジェクトID
TEST_PROJECT_ID="todolist-37a07"
# 本番プロジェクトID
PROD_PROJECT_ID="cyclictodo"

# 本番環境にインポート
firebase firestore:indexes --project $PROD_PROJECT_ID firestore.indexes.json
