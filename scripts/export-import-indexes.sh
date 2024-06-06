#!/bin/bash

# テストプロジェクトID
TEST_PROJECT_ID="todolist-37a07"
# 本番プロジェクトID
PROD_PROJECT_ID="cyclictodo"

firebase use todolist-37a07
firebase firestore:indexes > firestore.indexes.json
firebase use cyclictodo
firebase firestore:indexes firestore.indexes.json
