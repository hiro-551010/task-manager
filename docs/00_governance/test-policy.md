# テストポリシー

## 目的

- domainの不変条件を固定する
- ユースケースの振る舞いを保証する
- API / DB / 外部I/F の契約を壊さない
- バグ修正時に再発を防止する
- mainを常に安全な状態に保つ

---

## テストディレクトリ構成

```txt
tests/
  _shared/           # テスト専用共通（shared_kernelとは別）
    builders/
    fixtures/
    fakes/
    matchers/
    testkit/

  <ctx>/
    unit/
      domain/
      application/
    integration/
      persistence/
      migrations/
      external/
    contract/
      http/
```

E2E テストはフロントエンド（`apps/web/e2e/`）に配置する。詳細は `docs/01_project/e2e-policy.md` を参照。

- `tests/_shared` はテスト専用共通。`shared_kernel/` とは別。
- unit は domain と application を分離。
- integration は DB / Repo / migration を担保。
- contract は API 入出力の固定。
- e2e はフロントエンド側で管理し、クリティカルパスのみ。

---

## テスト階層

### Unit（最優先）
対象：domain層中心
目的：不変条件・境界値・異常系の固定
禁止：DB/HTTP/外部SDKの直接使用

### Integration
対象：Repository実装 / DB / migrations
DBは実物を使用する。
外部APIは原則モック。

### Contract
対象：HTTPリクエスト/レスポンス / status / validation
API変更時は必須。

### E2E
対象：クリティカルパスのみ
本数は最小限。

---

## 変更種別と必須テスト

- domain変更 → unit必須（対象ctx）
- application変更 → unit必須
- infrastructure/DB変更 → integration必須
- API変更 → contract必須
- バグ修正 → 再現テスト必須
- リファクタ → 既存テスト緑が前提

---

## テストを書くタイミング

- ドメイン層・アプリケーション層の実装が完了した後に書く
- 設計が固まる前にテストを書くとリファクタ時のコストが増すため、まず動く実装を揃える
- PR を `develop` にマージする前までに完成させる

---

## CIゲート

### 毎PR
- lint / format
- unit（全体）
- integration（変更ctx）
- contract（API変更時）

### 任意（nightly）
- 全integration
- 全e2e

CIが緑でないPRはマージ禁止。
