# user context — ユースケース

## RegisterUser（ユーザー登録）

**コマンド:** `{ name: string, email: string, password: string }`

**処理:**
1. メールアドレスの重複チェック（既存ならエラー）
2. パスワードをハッシュ化（Bun.password.hash）
3. User 集約を生成・保存
4. UserDto を返す

**出力:** `UserDto`

---

## GetUser（ユーザー取得）

**クエリ:** `{ id: string }`

**処理:**
1. ID でユーザーを検索
2. 存在しなければ ApplicationError

**出力:** `UserDto`

---

## GetAllUsers（ユーザー一覧）

**クエリ:** なし

**処理:**
1. 全ユーザーを取得（登録日時降順）

**出力:** `UserDto[]`

---

## UpdateUser（プロフィール更新）

**コマンド:** `{ id: string, name?: string }`

**処理:**
1. ID でユーザーを検索（存在しなければエラー）
2. 名前を更新・保存

**出力:** `UserDto`
