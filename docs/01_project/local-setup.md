# ローカル環境セットアップ

## 1. Git ユーザー設定

このリポジトリ専用の名前・メールアドレスを設定する。
グローバル設定を汚さないようにローカル設定（`--local`）を使うこと。

```bash
git config --local user.name "Your Name"
git config --local user.email "your.email@example.com"
```

設定確認：

```bash
git config --local --list
```

---

## 2. 環境変数

`.env.example` をコピーして `.env.local` を作成し、各自の環境に合わせて編集する。

```bash
cp .env.example .env.local
```

`.env.local` は `.gitignore` に含まれているためコミットしない。

---

## 3. 依存インストール・DB起動

```bash
bun install
docker compose up -d
```
