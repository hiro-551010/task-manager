# Claude Code Operating Model（DDD + Obsidian運用）

**設計方針：** このファイルは特定の技術スタックに依存しない粒度で記述する。プロジェクト固有のものはdocs/00_governance直下に集約し、そのファイルパスをCLAUDE.mdに記述する。

## 0. Claude Codeへの指示

### 参照ファイル（作業前に必ず読むこと）

- ディレクトリ構造：`docs/00_governance/directory-structure.md`
- 技術スタック：`docs/00_governance/tech-stack.md`
- ローカルセットアップ：`docs/00_governance/local-setup.md`（初回セットアップ時）

### 詳細ルール（該当作業時に必ず読むこと）

- 実装順序：`docs/00_governance/implementation-order.md`（新規コンテキスト実装時）
- 命名規則：`docs/00_governance/naming-conventions.md`（アプリケーション層実装時）
- テストポリシー：`docs/00_governance/test-policy.md`（テスト作成・修正時）
- 例外処理ポリシー：`docs/00_governance/error-policy.md`（実装時）
- Shared Kernelルール：`docs/00_governance/shared-kernel-rules.md`（`shared_kernel/` 変更時）
- CIルール：`docs/00_governance/ci-rules.md`（CI設定・ワークフロー変更時）
- Git運用ルール：`docs/00_governance/git-rules.md`（ブランチ作成・コミット・PRマージ時）

### 振る舞いルール

- 作業前に「参照ファイル」セクションのファイルを必ず読む。詳細ルールは該当作業時に読む。
- 実装前に対象 bounded-context とレイヤーをユーザーに確認する。
- ドキュメント（`docs/10_contexts/<ctx>/`）と実装の乖離を見つけたら必ず指摘する。
- `shared_kernel/` への追加を求められたら `docs/00_governance/shared-kernel-rules.md` を確認する。
- 変更範囲が不明な場合は実装前にユーザーに確認する。
- 仕様が未更新のまま実装を求められた場合は、先にドキュメント更新を促す。

---

## 1. 基本思想

- 本プロジェクトは DDD（Domain Driven Design）を採用する。
- Bounded Context 単位でコードと設計を分離する。
- ドキュメントを正本（Source of Truth）とし、実装はそれに従う。
- main / develop ブランチは常に「ドキュメントとコードが整合し、動作する状態」を維持する。

---

## 2. Obsidian 運用

`docs/` が正式ドキュメント（正本）であるのに対し、`notes/` は正式化する前の思考・共有の場として Obsidian で管理する。

| 用途 | 場所 |
|---|---|
| 実装中の気づき・TIL | `notes/til/` |
| バグ調査・技術調査ログ | `notes/investigation/` |
| ADR化前の議論 | `notes/discussion/` |
| ミーティングノート | `notes/meetings/` |

議論・調査が合意に至った場合は `docs/` または `docs/20_decisions/` に昇格させる。

---

## 3. ディレクトリ構造

詳細は `docs/00_governance/directory-structure.md` を参照すること。

- bounded-context の実装ディレクトリと `docs/10_contexts/<ctx>/` は 1:1 対応する。
- shared kernel はドメイン知識を含めない。
- 複数アプリ間で共有するコードは専用パッケージに分離し、ドメイン知識を含めない。
- DB変更はコンテキスト単位で管理する。

---

## 4. 依存関係ルール（厳守）

1. domain は外部ライブラリに依存しない。
2. application は domain に依存可能。
3. infrastructure は domain の Repository IF を実装する。
4. presentation は application を呼び出す。
5. bounded-context 同士は直接依存しない。
6. 依存違反は `tools/architecture-tests` により CI で検出する。

---

## 5. ワークフロー

**原則：ドキュメントは正本（Source of Truth）。実装はドキュメントに従う。**
ドキュメントが更新されていない変更は、実装前であっても受け入れない。

ブランチ命名・コミット規約・マージ方法の詳細は `docs/00_governance/git-rules.md` を参照すること。

作業種別によってブランチ運用と Docs ゲートの要否が異なる。

---

### 5.1 機能開発 / バグ修正

| 項目 | 内容 |
|---|---|
| ブランチ | `feature/<ctx>/<slug>` / `fix/<ctx>/<slug>` |
| Docs ゲート | 必須 |
| マージ先 | `develop`（Squash merge） |

1. `develop` からブランチを作成する。
2. 対象 bounded-context とレイヤーを特定する。
3. 該当ドキュメントを更新する。
4. **Docs ゲート**：以下を確認してから実装に進む。
   - domain 変更 → `docs/10_contexts/<ctx>/domain/model.md` `docs/10_contexts/<ctx>/domain/rules.md` が更新済みか
   - ユースケース追加・変更 → `docs/10_contexts/<ctx>/application/use-cases.md` が更新済みか
   - API 変更 → `docs/10_contexts/<ctx>/interfaces/api.md` が更新済みか
   - DB 変更 → `docs/10_contexts/<ctx>/data/schema.md` が更新済みか
5. 自己レビューで Docs ゲートを確認後、実装する。
6. テストを実行する。
7. PR を作成し、docs と code が一致していることを確認する。
8. PR を `develop` にマージ（Squash merge）後、ブランチを削除する。

---

### 5.2 ガバナンス変更

`docs/00_governance/` や `CLAUDE.md` 自体の変更。プロジェクト全体に影響するため、事前に `notes/discussion/` で合意を取ってから実施する。

| 項目 | 内容 |
|---|---|
| ブランチ | `docs/governance/<slug>` |
| Docs ゲート | 不要（ドキュメント自体が目的） |
| マージ先 | `develop`（Squash merge） |

1. `notes/discussion/` で変更内容を議論・合意する。
2. `develop` からブランチを作成する。
3. `docs/00_governance/` または `CLAUDE.md` を更新する。
4. コードへの影響がある場合は **別途 `feature/` または `chore/` ブランチ**で対応する（このブランチにコードを含めない）。
5. PR を作成し `develop` にマージする。

---

### 5.3 環境・ツール変更

パッケージ追加・Docker 設定・CI 設定・Biome/tsconfig 変更など。

| 項目 | 内容 |
|---|---|
| ブランチ | `chore/<slug>` |
| Docs ゲート | 不要（`docs/00_governance/` の更新は必要に応じて行う） |
| マージ先 | `develop`（Squash merge） |

1. `develop` からブランチを作成する。
2. 変更を実施する。
3. 影響があれば `docs/00_governance/` 内の該当ファイルを更新する。
4. PR を作成し `develop` にマージする。

---

### 5.4 初期環境構築（例外）

プロジェクト開始時の一回限りの環境構築は `develop` に直接コミットしてよい。

---

### 5.5 リリース

`develop` → `main` へ PR を作成し Squash merge する。

main / develop に未実装の仕様のみを反映してはならない。

---

## 6. セキュリティ方針

- 秘密情報は環境変数管理。
- domain層に秘密情報を持ち込まない。
- ログに機密情報を出力しない。

---

## 7. バージョニング方針

- 破壊的変更は明示する。
- API互換性は可能な限り維持する。
- breaking change時はADRを追加する。

---

## 8. 削除・廃止ポリシー

- 機能削除は必ずドキュメント更新を伴う。
- deprecated状態を経由してから削除する。
- DB削除はContractフェーズで実施する。

---

## 9. 禁止事項

- 仕様未更新での振る舞い変更
- domain層への外部依存追加
- bounded-contextの境界破壊
- shared_kernelの肥大化
- 未実装仕様の main / develop マージ
- 想定外例外の握りつぶし（UnexpectedErrorは必ずログ・監視対象）
- コンテキストのドキュメント・コードに他の bounded-context 名を直接記載すること（境界の曖昧化につながる）
