#!/bin/bash

# テストプロジェクトID
TEST_PROJECT_ID="todolist-37a07"
# 本番プロジェクトID
PROD_PROJECT_ID="cyclictodo"

# インデックスのエクスポート
firebase firestore:indexes --project $TEST_PROJECT_ID > firestore.indexes.json

# 本番環境にインポート
firebase firestore:indexes:deploy --project $PROD_PROJECT_ID --only firestore.indexes.json