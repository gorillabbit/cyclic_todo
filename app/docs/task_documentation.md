## タスク機能ドキュメント

### 概要

タスク機能を使用すると、ユーザーはアプリケーション内でタスクを作成、管理、および追跡できます。タスクには、期日、時刻、説明、および定期的なスケジュールを設定できます。ユーザーは、タスクを完了としてマークしたり、既存のタスクを編集したり、タスクを削除したりできます。

### データ構造

`TaskType` インターフェースは、タスクオブジェクトの構造を定義します。

```typescript
export interface TaskInputType {
    userId: string; // タスクを作成したユーザーのID
    text: string; // タスクのテキスト
    hasDue: boolean; // タスクに期日があるかどうか
    dueDate: string; // タスクの期日 (形式: yyyy年MM月dd日)
    hasDueTime: boolean; // タスクに時刻があるかどうか
    dueTime: string; // タスクの時刻 (形式: HH時mm分)
    completed: boolean; // タスクが完了したかどうか
    isCyclic: string; // タスクの定期的なスケジュール ('周期なし', '完了後に追加', '必ず追加')
    cyclicCount: string; // 定期的なスケジュールの日数
    cyclicUnit: string; // 定期的なスケジュールの単位 ('日', '週', '月', '年')
    親taskId?: string; // 親タスクのID (タスクがサブタスクの場合)
    toggleCompletionTimestamp?: Timestamp; // タスクが完了としてマークされたときのタイムスタンプ
    icon: string;
    description: string; // タスクの説明
    tabId: string; // タスクが属するタブのID
}

export interface TaskType extends TaskInputType {
    id: string; // タスクのID
}
```

### コンポーネント

- **`Task.tsx`**: このコンポーネントは、単一のタスクを表示します。タスクのテキスト、説明、期日、時刻、およびタスクを完了としてマークまたは削除するためのボタンが含まれています。また、タスクを編集するためのボタンも含まれています。
- **`TaskDetail.tsx`**: このコンポーネントは、完了タイムスタンプなど、タスクの詳細を表示します。
- **`TaskList.tsx`**: このコンポーネントは、タスクのリストを表示します。`TaskContext` からタスクをフェッチし、`Masonry` レイアウトで表示します。また、完了したタスクを表示または非表示にするためのボタンも含まれています。
- **`TaskInputForm.tsx`**: このコンポーネントは、タスクの作成および編集に使用されるフォームです。タスクのテキスト、説明、期日、時刻、定期的なスケジュール、およびその他のプロパティのフィールドが含まれています。

### コンテキスト

- **`TaskContext.tsx`**: このコンテキストは、アプリケーションにタスクのリストを提供します。`useFirestoreQuery` フックを使用して、Firestore からタスクをフェッチします。

### フォーム

- **`TaskInputForm.tsx`**: このフォームは、タスクの作成および編集に使用されます。次のフィールドが含まれています。
    - タスクのテキスト
    - 説明
    - 期日
    - 時刻
    - 定期的なスケジュール
    - その他のプロパティ

### APIエンドポイント

次のFirebase関数は、タスクを操作するために使用されます。

- `addDocTask`: Firestoreに新しいタスクを追加します。
- `updateDocTask`: Firestore内の既存のタスクを更新します。
- `deleteDocTask`: Firestoreからタスクを削除します。

### ログ機能

#### 概要

ログ機能を使用すると、ユーザーはアプリケーション内でログを作成、管理、および追跡できます。ログには、期間、間隔、メモ、および音声アナウンスを設定できます。ユーザーは、ログをアーカイブしたり、既存のログを編集したり、ログを削除したりできます。

#### データ構造

`LogType` インターフェースは、ログオブジェクトの構造を定義します。

```typescript
export interface InputLogType {
    userId: string;
    text: string;
    親logId?: string;
    timestamp?: Timestamp;
    completeLogs?: LogsCompleteLogsType[];
    duration: boolean;
    interval: boolean;
    intervalNum: number;
    intervalUnit: string;
    availableMemo: boolean;
    availableVoiceAnnounce: boolean;
    voiceAnnounceNum?: number;
    voiceAnnounceUnit?: string;
    icon?: string;
    displayFeature: string[];
    description: string;
    archived: boolean;
    accessibleAccounts: string[];
    tabId: string;
}

export interface LogType extends InputLogType {
    id: string;
}
```

#### コンポーネント

- **`Log.tsx`**: このコンポーネントは、単一のログを表示します。ログのテキスト、説明、期間、間隔、メモ、および音声アナウンスが含まれています。また、ログをアーカイブしたり、既存のログを編集したり、ログを開始/完了したり、ログを削除したりするためのボタンも含まれています。
- **`LogList.tsx`**: このコンポーネントは、ログのリストを表示します。`LogContext` からログをフェッチし、`Masonry` レイアウトで表示します。また、アーカイブされたログを表示または非表示にするためのボタンも含まれています。
- **`LogFeature.tsx`**: このコンポーネントは、ログの機能を表示します。前回からの間隔、標準間隔、本日回数、通算回数、および音声アナウンスが含まれています。

#### コンテキスト

- **`LogContext.tsx`**: このコンテキストは、アプリケーションにログのリストを提供します。`useFirestoreQuery` フックを使用して、Firestore からログをフェッチします。

#### フォーム

- **`LogInputForm.tsx`**: このフォームは、ログの作成および編集に使用されます。次のフィールドが含まれています。
    - ログのテキスト
    - 説明
    - 期間
    - 間隔
    - メモ
    - 音声アナウンス
    - 共有アカウント

#### APIエンドポイント

次のFirebase関数は、ログを操作するために使用されます。

- `addDocLog`: Firestoreに新しいログを追加します。
- `updateDocLog`: Firestore内の既存のログを更新します。

### 家計簿機能

#### 概要

家計簿機能を使用すると、ユーザーはアプリケーション内で家計簿を作成、管理、および追跡できます。

#### データ構造

`app/src/types/purchaseTypes.ts` ファイルで定義されているデータ構造を以下に示します。

```typescript
import { Timestamp } from 'firebase/firestore';

interface PurchaseBaseType {
    userId: string; // ユーザーID
    title: string; // タイトル
    date: Date; // 商品を買った日
    payDate: Date; // お金を支払った日
    method: string; // 支払い方法
    category: string; // カテゴリー
    description: string; // 説明
    isUncertain?: boolean; // 不確定かどうか
    isGroup?: boolean; // グループかどうか
    tabId: string; // タブID
    assetId: string; // 資産ID
}

export interface InputFieldPurchaseType extends PurchaseBaseType {
    price: number; // 価格
    income: boolean; // 収入かどうか
    id: string; // ID
}

export interface PurchaseDataType extends PurchaseBaseType {
    difference: number; // 差額
    balance: number; // 残高
    parentScheduleId?: string; // 親スケジュールID
    id: string; // ID
}

export interface PurchaseRawDataType extends Omit<PurchaseDataType, 'date' | 'payDate'> {
    id: string;
    date: Timestamp; // 商品を買った日
    payDate: Timestamp; // お金を支払った日
}

export interface TemplateButtonType extends InputFieldPurchaseType {
    id: string; // ID
}
```

#### コンポーネント

- **`DeleteConfirmDialog.tsx`**: 削除確認ダイアログ
- **`KakeiboSchemas.ts`**: 家計簿のスキーマ定義
- **`TableCellWrapper.tsx`**: テーブルセルラッパー
- **`AssetRow.tsx`**: 資産行
- **`AssetsList.tsx`**: 資産リスト
- **`MethodList.tsx`**: 支払い方法リスト
- **`MethodRow.tsx`**: 支払い方法行
- **`ContextInputDialog.tsx`**: コンテキスト入力ダイアログ
- **`InputsContainer.tsx`**: 入力コンテナ
- **`PurchaseInput.tsx`**: 購入入力
- **`PurchaseScheduleInput.tsx`**: 購入スケジュール入力
- **`ReceiptScanner.tsx`**: レシートスキャナー
- **`TemplateButton.tsx`**: テンプレートボタン
- **`TemplateButtonsContainer.tsx`**: テンプレートボタンコンテナ
- **`TransferInput.tsx`**: 振替入力
- **`TransferTemplateButton.tsx`**: 振替テンプレートボタン
- **`TransferTemplateButtonContainer.tsx`**: 振替テンプレートボタンコンテナ
- **`NarrowDownDialog.tsx`**: 絞り込みダイアログ
- **`Purchases.tsx`**: 購入リスト
- **`PurchaseSchedules.tsx`**: 購入スケジュールリスト
- **`TableHeadCell.tsx`**: テーブルヘッダーセル
- **`CategorySelector.tsx`**: カテゴリーセレクター
- **`MethodSelector.tsx`**: 支払い方法セレクター

#### APIエンドポイント

次のFirebase関数は、家計簿を操作するために使用されます。

- `createPurchase`: Firestoreに新しい購入を追加します。
- `updatePurchase`: Firestore内の既存の購入を更新します。
- `deletePurchase`: Firestoreから購入を削除します。
- `createPurchaseSchedule`: Firestoreに新しい購入スケジュールを追加します。
- `updatePurchaseSchedule`: Firestore内の既存の購入スケジュールを更新します。
- `createPurchaseTemplate`: Firestoreに新しい購入テンプレートを追加します。
- `updatePurchaseTemplate`: Firestore内の既存の購入テンプレートを更新します。
