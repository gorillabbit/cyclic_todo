#!/bin/bash

# テストプロジェクトID
TEST_PROJECT_ID="todolist-37a07"
# 本番プロジェクトID
PROD_PROJECT_ID="cyclictodo"

# インデックスのエクスポート
firebase firestore:indexes --project $TEST_PROJECT_ID > firestore.indexes.utf16.json
