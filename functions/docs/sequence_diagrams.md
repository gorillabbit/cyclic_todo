# サービス層シーケンス図ドキュメント

## アーキテクチャ概要

```mermaid
graph TD
    C[クライアント] --> E[Expressルーター]
    E --> S[サービス層]
    S --> B[BaseService]
    B --> T[TypeORM]
    T --> D[データベース]
```

## 典型的なCRUD操作フロー

### アカウント作成（正常系）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Express as Expressルーター
    participant AccountService as AccountService
    participant BaseService as BaseService
    participant TypeORM as TypeORM
    participant DB as データベース

    Client->>+Express: POST /api/account
    Express->>+AccountService: create(body)
    AccountService->>+BaseService: create(entityData)
    BaseService->>+TypeORM: createQueryBuilder()
    TypeORM->>+DB: INSERT INTO accounts...
    DB-->>-TypeORM: 挿入結果
    TypeORM-->>-BaseService: エンティティ
    BaseService-->>-AccountService: 作成済みエンティティ
    AccountService-->>-Express: 結果
    Express-->>-Client: 201 Created
```

### エラーハンドリングフロー

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Express as Expressルーター
    participant Service as サービス層
    participant BaseService as BaseService

    Client->>+Express: POST /api/entity
    Express->>+Service: create(data)
    Service->>+BaseService: create(data)
    BaseService--xService: DatabaseError
    Service->>Service: handleError()
    Service-->>-Express: エラー詳細
    Express-->>-Client: 500 Internal Server Error
```

## 主要コンポーネントの責務

### Expressルーター

- APIエンドポイントの定義
- リクエストのバリデーション
- サービス層への処理委譲
- クライアントへのレスポンス返却

### サービス層（例：AccountService）

```typescript
class AccountService extends BaseService {
    // ドメイン固有のビジネスロジック実装
    async create(entityData) {
        // カスタムバリデーション
        return super.create(entityData);
    }
}
```

### BaseService

```typescript
abstract class BaseService {
    // 共通CRUD操作実装
    async create(entityData) {
        try {
            return await repository.save(entityData);
        } catch (error) {
            this.handleError('create', error);
        }
    }
}
```

## データベース初期化フロー

```mermaid
sequenceDiagram
    participant Firebase as Firebase Functions
    participant DB as データベース
    participant Express as Expressアプリ

    Firebase->>+DB: initializeDatabase()
    DB-->>-Firebase: 接続成功
    Firebase->>+Express: ルート設定
    Express-->>-Firebase: 設定完了
    Note over Firebase: リクエスト受信時<br/>dbInitPromiseをawait
```

## 例外処理ポリシー

1. **データベースエラー**:

    - `DatabaseError`クラスでラップ
    - スタックトレース含めてログ出力

2. **ビジネスロジックエラー**:

    - `AppError`クラスで表現
    - クライアントに詳細を返却

3. **予期せぬエラー**:
    - グローバルエラーハンドラで捕捉
    - サニタイズしたメッセージを返却

## クライアント側シーケンス図

### タスク作成フロー

```mermaid
sequenceDiagram
    participant UI as Reactコンポーネント
    participant Context as TaskContext
    participant API as APIクライアント
    participant Server as バックエンド

    UI->>+Context: handleSubmit()
    Context->>+API: postTask(taskData)
    API->>+Server: POST /api/tasks
    Server-->>-API: レスポンス
    API-->>-Context: 正規化データ
    Context->>Context: 状態更新
    Context-->>-UI: 処理結果通知
```

### 認証フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant UI as LoginPage
    participant Auth as Firebase認証
    participant Router as ReactRouter

    User->>+UI: ログイン操作
    UI->>+Auth: signInWithPopup()
    Auth-->>-UI: ユーザー情報
    UI->>+Router: ナビゲーション
    Router-->>-User: ホーム画面表示
```

## コンポーネントライフサイクル

```mermaid
sequenceDiagram
    participant Parent as 親コンポーネント
    participant Child as 子コンポーネント
    participant Context as アプリケーションコンテキスト

    Parent->>+Child: マウント
    Child->>+Context: useContext()
    Context-->>-Child: 最新状態
    Child-->>-Parent: レンダリング完了
    loop 状態更新時
        Context->>Child: 再レンダー
    end
```
