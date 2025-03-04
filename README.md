# Cyclic Todo

## 説明

Cyclic Todo は、タスク、 финансы、ログを管理するのに役立つモノレポアプリケーションです。フロントエンド（`app`ディレクトリ）、バックエンド（`functions`ディレクトリ）、およびデータ管理とデプロイメントのためのさまざまなスクリプトで構成されています。

## 特徴

### タスク管理

-   **タスク管理:** タスクの作成、管理、追跡を行います。
-   **カレンダー連携:** Google カレンダーと連携して、タスクやイベントを表示および管理します。

### 家計簿

-   **財務追跡:** 収入と支出を追跡します。
-   **レシートスキャン:** レシートをスキャンして、購入情報を自動的に入力します。

### その他

-   **ログ管理:** 毎日の活動を記録および管理します。
-   **アカウント共有:** アカウントを他のユーザーと共有して、共同でタスクと財務を管理します。

## プロジェクト構成

-   `app/`: React と TypeScript で構築されたフロントエンドコードが含まれています。
-   `functions/`: Firebase Cloud Functions として実装されたバックエンドコードが含まれています。
-   `dummy/`: ダミーデータとテストユーティリティが含まれています。
-   `python_scripts/`: データ処理とデータベース管理のための Python スクリプトが含まれています。
-   `scripts/`: データ移行やデプロイメントなど、さまざまなタスクのための JavaScript スクリプトが含まれています。

## 使用技術

-   **フロントエンド:** React, TypeScript, Material UI
-   **バックエンド:** Firebase Cloud Functions, Node.js
-   **データベース:** Firebase Firestore
-   **その他:** Python, JavaScript

## セットアップ手順

1.  **依存関係のインストール:**

    ```bash
    cd app
    npm install
    cd ../functions
    npm install
    ```

2.  **Firebase の設定:**

    -   [Firebase コンソール](https://console.firebase.google.com/)で Firebase プロジェクトを作成します。
    -   Firestore と Cloud Functions を有効にします。
    -   Firebase CLI を使用して Firebase クレデンシャルを設定します。

        ```bash
        firebase login
        firebase use <your-project-id>
        ```

3.  **バックエンドのデプロイ:**

    ```bash
    cd functions
    firebase deploy --only functions
    ```

4.  **フロントエンドの実行:**

    ```bash
    cd app
    npm run dev
    ```

## 貢献

貢献は大歓迎です！以下の手順に従ってください。

1.  リポジトリをフォークします。
2.  機能またはバグ修正のために新しいブランチを作成します。
3.  変更を実装します。
4.  プルリクエストを送信します。

## ライセンス

[MIT](LICENSE)
