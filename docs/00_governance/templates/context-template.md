# `<ctx>` コンテキスト

## ディレクトリ構成

```
docs/10_contexts/<ctx>/
├── _index.md
├── context.md
├── domain/
│   ├── model.md
│   ├── rules.md
│   └── events.md        # ドメインイベントがある場合
├── application/
│   └── use-cases.md
├── interfaces/
│   └── api.md
├── data/
│   └── schema.md
└── adr/                 # ctx 固有の意思決定記録
```

---

## 各ファイルの記述ガイド

### _index.md
- このコンテキストの一言説明
- 配下ドキュメントへのリンク一覧

### context.md
- 責務（何をするコンテキストか）
- 境界（何をしないか）
- 他コンテキストとの依存関係

### domain/model.md
- Aggregate・Entity・ValueObject の定義
- フィールド・型・制約
- ステータス遷移図（必要な場合）

### domain/rules.md
- 不変条件・バリデーションルール
- ビジネスルール（「〜してはならない」「〜でなければならない」）

### domain/events.md
- ドメインイベントの一覧と発火条件

### application/use-cases.md
- コマンド・クエリの一覧
- 各ユースケースの入力・出力・DTO定義

### interfaces/api.md
- REST エンドポイント一覧
- リクエスト・レスポンス例
- エラーレスポンス

### data/schema.md
- DB テーブル定義
- マイグレーション方針（Expand/Contract）
