# ディレクトリ構造（このプロジェクト）

汎用的な構造原則（DDDレイヤー・テスト構造・docs階層等）は `docs/00_governance/directory-structure.md` を参照すること。

---

```
project-root/
├── .obsidian/                               # Obsidian設定（Vault化の中核）
│
├── notes/                                   # 非公式ノート（Obsidianで管理）
│   ├── til/
│   ├── investigation/
│   ├── discussion/
│   └── meetings/
│
├── docs/                                    # 設計・仕様（正本）
│   ├── 00_governance/                       # 汎用ガバナンス原則
│   │   └── templates/
│   │       ├── adr-template.md
│   │       └── context-template.md
│   │
│   ├── 01_project/                          # プロジェクト固有設定
│   │
│   ├── 10_contexts/                         # bounded-context単位の設計（コードと1:1）
│   │   └── <ctx>/
│   │       ├── _index.md
│   │       ├── context.md
│   │       ├── domain/
│   │       │   ├── model.md
│   │       │   ├── rules.md
│   │       │   └── events.md
│   │       ├── application/
│   │       │   └── use-cases.md
│   │       ├── interfaces/
│   │       │   └── api.md
│   │       ├── data/
│   │       │   └── schema.md
│   │       └── adr/
│   │
│   ├── 20_decisions/                        # 全体ADR（横断意思決定）
│   │   ├── adr-index.md
│   │   └── 2026-xx-xx-adr-0001.md
│   │
│   └── 30_frontend/                         # フロントエンド設計（apps/web と1:1）
│       ├── architecture.md
│       └── <ctx>/
│           └── _index.md
│
├── apps/                                    # アプリケーション
│   ├── api/                                 # バックエンド（Hono + DDD）
│   │   ├── modules/                         # bounded-context実装
│   │   │   └── <ctx>/
│   │   │       ├── domain/
│   │   │       ├── application/
│   │   │       ├── infrastructure/
│   │   │       └── presentation/
│   │   │
│   │   ├── shared_kernel/                   # Shared Kernel（API内共通）
│   │   │   ├── types/
│   │   │   ├── errors/
│   │   │   ├── ids/
│   │   │   ├── datetime/
│   │   │   └── utils/
│   │   │
│   │   ├── migrations/                      # DB移行（ctx単位）
│   │   │   └── <ctx>/
│   │   │
│   │   ├── tests/
│   │   │   ├── _shared/
│   │   │   │   ├── builders/
│   │   │   │   ├── fixtures/
│   │   │   │   ├── fakes/
│   │   │   │   ├── matchers/
│   │   │   │   └── testkit/
│   │   │   └── <ctx>/
│   │   │       ├── unit/
│   │   │       │   ├── domain/
│   │   │       │   └── application/
│   │   │       ├── integration/
│   │   │       │   ├── persistence/
│   │   │       │   ├── migrations/
│   │   │       │   └── external/
│   │   │       └── contract/
│   │   │           └── http/
│   │   │
│   │   ├── tools/
│   │   │   └── architecture-tests/
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── drizzle.config.ts
│   │
│   └── web/                                 # フロントエンド（Next.js）
│       ├── src/
│       │   ├── app/                         # App Router
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── <ctx>/
│       │   ├── components/
│       │   │   ├── ui/                      # shadcn/ui コンポーネント
│       │   │   └── features/                # 機能単位コンポーネント
│       │   └── lib/                         # ユーティリティ・APIクライアント
│       ├── e2e/                             # E2E テスト（Playwright）
│       │   ├── playwright.config.ts
│       │   ├── smoke/
│       │   ├── scenarios/
│       │   │   └── <ctx>/
│       │   └── fixtures/
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.ts
│
├── packages/                                # 共有パッケージ
│   └── shared/                              # フロント・バック共通
│       ├── src/
│       │   ├── types/                       # APIリクエスト/レスポンス型
│       │   ├── schemas/                     # Zodスキーマ（共通バリデーション）
│       │   └── constants/                   # 共通定数
│       └── package.json
│
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml
│
├── package.json                             # Bun workspaces ルート
├── biome.json
├── CLAUDE.md
├── README.md
└── .gitignore
```
