# user context — 不変条件・バリデーション

## UserName

- 空文字禁止
- 最大 50 文字

## Email

- RFC 準拠のメールアドレス形式
- 一意制約（アプリケーション層で重複チェック）

## Password（登録時の平文）

- 最小 8 文字
- ハッシュ化は application 層（RegisterUserHandler）で実施
- domain 層はハッシュ済み文字列を受け取る

## PasswordHash

- 空文字禁止
- domain 層では内容を検証しない（ハッシュ済みであることを信頼する）
