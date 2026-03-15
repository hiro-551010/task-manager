# 実装順序メモ

## 方針

ドキュメント → ドメイン → アプリケーション → インフラ → プレゼンテーション → テスト

## 理由

- ドメイン層から始めることで外部依存なしに設計を固められる
- アプリケーション層はドメインにのみ依存するため次に実装しやすい
- インフラ層はドメインのRepository IFを実装するだけなので後回し可能
- プレゼンテーション層はアプリケーション層が揃ってから繋ぐ
- テストは設計が固まった後にまとめて書く（`notes/discussion/test-strategy.md` 参照）

## 進捗

- [x] ドキュメント（docs/10_contexts/task/）
- [x] ドメイン層（aggregates / value-objects / events / repositories IF）
- [x] アプリケーション層（commands / queries / handlers / dtos）
- [ ] インフラ層（schema / repository実装 / DB接続）
- [ ] プレゼンテーション層（HTTP routes / controllers）
- [ ] テスト（unit / integration / contract）
