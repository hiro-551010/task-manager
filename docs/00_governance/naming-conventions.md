# 命名規則

## アプリケーション層

コンテキスト名（例：`task`）はファイルパスで表現されるため、クラス名に繰り返さない。

| 種別 | 命名 | 例 |
|---|---|---|
| コマンド | 動詞のみ | `Create` / `Update` / `ChangeStatus` / `Delete` |
| クエリ | 動詞のみ | `Get` / `GetAll` |
| ハンドラー | 動詞 + コンテキスト名 + Handler | `CreateTaskHandler` / `GetTaskHandler` |

### 理由

- パス（`modules/task/application/commands/create.ts`）がコンテキストを示している
- コマンド・クエリ名での繰り返しは冗長
- ハンドラーは presentation 層からインポートされるため、コンテキスト名を含めて明示的にする
