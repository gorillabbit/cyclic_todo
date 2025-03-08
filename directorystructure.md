以下のディレクトリ構造に従って実装を行ってください：

```
.
├── app
│ ├── docs
│ │ ├── client_sequence_diagrams.md
│ │ ├── code_modification_proposals.md
│ │ ├── data_flow_analysis.md
│ │ ├── kakeibo_refactoring_proposals.md
│ │ └── task_documentation.md
│ ├── eslint.config.cjs
│ ├── favicon.ico
│ ├── index.html
│ ├── lib
│ │ ├── assets
│ │ │ ├── bootstrap-icons-BOrJxbIo.woff
│ │ │ ├── bootstrap-icons-BtvjY1KL.woff2
│ │ │ ├── favicon-B2L-9G-n.ico
│ │ │ ├── index-CWY3g15S.css
│ │ │ └── index-edM8i9Xt.js
│ │ ├── index.html
│ │ ├── logo192.png
│ │ ├── logo512.png
│ │ ├── manifest.json
│ │ └── vite.svg
│ ├── package.json
│ ├── package-lock.json
│ ├── public
│ │ ├── logo192.png
│ │ ├── logo512.png
│ │ ├── manifest.json
│ │ └── vite.svg
│ ├── set-secrets.sh
│ ├── src
│ │ ├── api
│ │ │ ├── apiClient.ts
│ │ │ ├── createApi.ts
│ │ │ ├── deleteApi.ts
│ │ │ ├── getApi.ts
│ │ │ └── updateApi.ts
│ │ ├── App.css
│ │ ├── App.tsx
│ │ ├── assets
│ │ │ └── react.svg
│ │ ├── components
│ │ │ ├── AccountChip.tsx
│ │ │ ├── AccountShareButton.tsx
│ │ │ ├── Calendar
│ │ │ │ ├── Calendar.tsx
│ │ │ │ └── EventContent.tsx
│ │ │ ├── CalendarSignInButton.tsx
│ │ │ ├── ChipWrapper.tsx
│ │ │ ├── Context
│ │ │ │ ├── AccountContext.tsx
│ │ │ │ ├── AssetContext.tsx
│ │ │ │ ├── LogContext.tsx
│ │ │ │ ├── MethodContext.tsx
│ │ │ │ ├── PurchaseContext.tsx
│ │ │ │ ├── TabContext.tsx
│ │ │ │ └── TaskContext.tsx
│ │ │ ├── Header.tsx
│ │ │ ├── InputForms
│ │ │ │ ├── InputForms.tsx
│ │ │ │ ├── LogInputForm.tsx
│ │ │ │ ├── TaskInputForm.tsx
│ │ │ │ └── ToggleButtons.tsx
│ │ │ ├── Kakeibo
│ │ │ │ ├── Asset
│ │ │ │ │ ├── AssetRow.tsx
│ │ │ │ │ ├── AssetsList.tsx
│ │ │ │ │ ├── MethodList.tsx
│ │ │ │ │ └── MethodRow.tsx
│ │ │ │ ├── DeleteConfirmDialog.tsx
│ │ │ │ ├── Input
│ │ │ │ │ ├── ContextInputDialog.tsx
│ │ │ │ │ ├── InputsContainer.tsx
│ │ │ │ │ ├── PurchaseInput.tsx
│ │ │ │ │ ├── PurchaseScheduleInput.tsx
│ │ │ │ │ ├── ReceiptScanner.tsx
│ │ │ │ │ ├── TemplateButtonsContainer.tsx
│ │ │ │ │ ├── TemplateButton.tsx
│ │ │ │ │ ├── TransferInput.tsx
│ │ │ │ │ ├── TransferTemplateButtonContainer.tsx
│ │ │ │ │ └── TransferTemplateButton.tsx
│ │ │ │ ├── KakeiboSchemas.ts
│ │ │ │ ├── PurchasesTable
│ │ │ │ │ ├── Charts
│ │ │ │ │ │ ├── BalanceChart.tsx
│ │ │ │ │ │ ├── ChartContainer.tsx
│ │ │ │ │ │ ├── ChartUtils.tsx
│ │ │ │ │ │ ├── DefaultConst.ts
│ │ │ │ │ │ ├── MonthlyBarChats.tsx
│ │ │ │ │ │ └── StackedBarChart.tsx
│ │ │ │ │ ├── NarrowDownDialog.tsx
│ │ │ │ │ ├── PurchaseRow
│ │ │ │ │ │ ├── EditPricePurchaseRow.tsx
│ │ │ │ │ │ ├── EditPurchaseRow.tsx
│ │ │ │ │ │ ├── NormalPurchaseRow.tsx
│ │ │ │ │ │ ├── PurchaseRowButtons.tsx
│ │ │ │ │ │ └── PurchasesRow.tsx
│ │ │ │ │ ├── PurchaseScheduleRow
│ │ │ │ │ │ ├── EditPurchaseScheduleRow.tsx
│ │ │ │ │ │ ├── NormalPurchaseScheduleRow.tsx
│ │ │ │ │ │ └── PurchaseScheduleRow.tsx
│ │ │ │ │ ├── PurchaseSchedules.tsx
│ │ │ │ │ ├── Purchases.tsx
│ │ │ │ │ └── TableHeadCell.tsx
│ │ │ │ ├── ScreenParts
│ │ │ │ │ ├── CategorySelector.tsx
│ │ │ │ │ └── MethodSelector.tsx
│ │ │ │ └── TableCellWrapper.tsx
│ │ │ ├── Log
│ │ │ │ ├── CompleteLog.tsx
│ │ │ │ ├── LogArchiveButton.tsx
│ │ │ │ ├── LogCompleteButton.tsx
│ │ │ │ ├── LogDeleteButton.tsx
│ │ │ │ ├── LogFeature.tsx
│ │ │ │ ├── LogHeader.tsx
│ │ │ │ ├── LogList.tsx
│ │ │ │ ├── LogStartButton.tsx
│ │ │ │ ├── Log.tsx
│ │ │ │ ├── MemoDialog.tsx
│ │ │ │ └── Stopwatch.tsx
│ │ │ ├── ShareTabDialog.tsx
│ │ │ ├── StyledCheckbox.tsx
│ │ │ ├── Tabs.tsx
│ │ │ ├── Task
│ │ │ │ ├── ChildTask.tsx
│ │ │ │ ├── TaskDetail.tsx
│ │ │ │ ├── TaskList.tsx
│ │ │ │ └── Task.tsx
│ │ │ └── TypographyWrapper.tsx
│ │ ├── firebase.ts
│ │ ├── hooks
│ │ │ ├── useData.ts
│ │ │ └── useWindowSize.tsx
│ │ ├── icons
│ │ │ └── googleCalendarIcon.svg
│ │ ├── index.css
│ │ ├── logo.svg
│ │ ├── main.tsx
│ │ ├── pages
│ │ │ ├── HomePage.tsx
│ │ │ ├── KiyakuPage.tsx
│ │ │ ├── LoginPage.tsx
│ │ │ ├── PurchasePage.tsx
│ │ │ └── TaskPage.tsx
│ │ ├── Routes.tsx
│ │ ├── types
│ │ │ └── purchaseTypes.ts
│ │ ├── types.ts
│ │ ├── utilities
│ │ │ ├── dateUtilities.ts
│ │ │ ├── firebaseUtilities.ts
│ │ │ ├── parseJsonUtils.ts
│ │ │ ├── purchaseUtilities.ts
│ │ │ └── taskUtilities.ts
│ │ └── vite-env.d.ts
│ ├── tsconfig.json
│ ├── tsconfig.tsbuildinfo
│ └── vite.config.ts
├── firebase.json
├── functions
│ ├── docs
│ │ └── sequence_diagrams.md
│ ├── eslint.config.cjs
│ ├── firebase-debug.log
│ ├── jest.config.cjs
│ ├── lib
│ │ ├── db.js
│ │ ├── db.js.map
│ │ ├── entities
│ │ │ ├── Accounts.js
│ │ │ ├── Accounts.js.map
│ │ │ ├── Assets.js
│ │ │ ├── Assets.js.map
│ │ │ ├── LogsCompleteLogs.js
│ │ │ ├── LogsCompleteLogs.js.map
│ │ │ ├── Logs.js
│ │ │ ├── Logs.js.map
│ │ │ ├── Methods.js
│ │ │ ├── Methods.js.map
│ │ │ ├── PurchaseSchedules.js
│ │ │ ├── PurchaseSchedules.js.map
│ │ │ ├── Purchases.js
│ │ │ ├── Purchases.js.map
│ │ │ ├── PurchaseTemplates.js
│ │ │ ├── PurchaseTemplates.js.map
│ │ │ ├── Tabs.js
│ │ │ ├── Tabs.js.map
│ │ │ ├── Tasks.js
│ │ │ ├── Tasks.js.map
│ │ │ ├── TransferTemplates.js
│ │ │ └── TransferTemplates.js.map
│ │ ├── index.js
│ │ ├── index.js.map
│ │ └── services
│ │ ├── accountService.js
│ │ ├── accountService.js.map
│ │ ├── assetService.js
│ │ ├── assetService.js.map
│ │ ├── logService.js
│ │ ├── logService.js.map
│ │ ├── methodService.js
│ │ ├── methodService.js.map
│ │ ├── purchaseScheduleService.js
│ │ ├── purchaseScheduleService.js.map
│ │ ├── purchaseService.js
│ │ ├── purchaseService.js.map
│ │ ├── purchaseTemplateService.js
│ │ ├── purchaseTemplateService.js.map
│ │ ├── serviceUtils.js
│ │ ├── serviceUtils.js.map
│ │ ├── tabService.js
│ │ ├── tabService.js.map
│ │ ├── taskService.js
│ │ ├── taskService.js.map
│ │ ├── transferTemplate.js
│ │ └── transferTemplate.js.map
│ ├── package.json
│ ├── package-lock.json
│ ├── set-secrets.sh
│ ├── src
│ │ ├── db.ts
│ │ ├── entities
│ │ │ ├── Accounts.ts
│ │ │ ├── Assets.ts
│ │ │ ├── LogsCompleteLogs.ts
│ │ │ ├── Logs.ts
│ │ │ ├── Methods.ts
│ │ │ ├── PurchaseSchedules.ts
│ │ │ ├── Purchases.ts
│ │ │ ├── PurchaseTemplates.ts
│ │ │ ├── Tabs.ts
│ │ │ ├── Tasks.ts
│ │ │ └── TransferTemplates.ts
│ │ ├── index.ts
│ │ └── services
│ │ ├── accountService.ts
│ │ ├── assetService.ts
│ │ ├── logService.ts
│ │ ├── methodService.ts
│ │ ├── purchaseScheduleService.ts
│ │ ├── purchaseService.ts
│ │ ├── purchaseTemplateService.ts
│ │ ├── serviceUtils.ts
│ │ ├── tabService.ts
│ │ ├── taskService.ts
│ │ └── transferTemplate.ts
│ └── tsconfig.json
├── python_scripts
│ ├── add_non_null_assertions.py
│ ├── create_aurora_table.py
│ ├── createAuroraTables.sql
│ ├── data
│ │ ├── Accounts.json
│ │ ├── Assets.json
│ │ ├── logsCompleteLogs.json
│ │ ├── logs.json
│ │ ├── Methods.json
│ │ ├── PurchaseSchedules.json
│ │ ├── Purchases.json
│ │ ├── PurchaseTemplates.json
│ │ ├── Tabs.json
│ │ ├── tasks.json
│ │ └── TransferTemplates.json
│ ├── export_from_firestore.py
│ ├── format_json.py
│ ├── import_to_aurora.py
│ ├── log
│ │ ├── create_aurora_table_log.txt
│ │ ├── export_from_firestore_loh.txt
│ │ ├── format_json_log.txt
│ │ └── import_to_aurora_log.txt
│ ├── model_gen.py
│ ├── models.py
│ ├── output
│ │ ├── accounts.json
│ │ ├── Accounts.json
│ │ ├── assets.json
│ │ ├── Assets.json
│ │ ├── methods.json
│ │ ├── Methods.json
│ │ ├── purchase_schedules.json
│ │ ├── PurchaseSchedules.json
│ │ ├── purchases.json
│ │ ├── Purchases.json
│ │ ├── purchase_templates.json
│ │ ├── PurchaseTemplates.json
│ │ ├── tabs.json
│ │ ├── Tabs.json
│ │ ├── transfer_templates.json
│ │ └── TransferTemplates.json
│ ├── **pycache**
│ │ └── models.cpython-313.pyc
│ ├── pyproject.toml
│ ├── README.md
│ ├── service_account_prod.json
│ ├── service_account_test.json
│ └── uv.lock
├── README.md
├── renovate.json
├── scripts
│ ├── addPayDayColumn.js
│ ├── addPayDayColumnPrd.js
│ ├── changePriceIntoDifferenceAndBalance.js
│ ├── changePriceIntoDifferenceAndBalancePrd.js
│ ├── changeUID.js
│ ├── exportFirestoreData.js
│ ├── service_account.json
│ ├── service_account_prd.json
│ ├── setTabId_2.js
│ ├── setTabId_2_prd.js
│ ├── setTabId.js
│ └── 本番データコピー手順書.md
└── メモ
├── データベース移植手順.md
└── メモ.md

43 directories, 273 files
```
