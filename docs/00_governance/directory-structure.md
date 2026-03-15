project-root/
├── .obsidian/                               # Obsidian設定（Vault化の中核）
│
├── notes/                                   # 📝 非公式ノート（Obsidianで管理）
│   ├── til/                                 # 実装中の気づき・TIL
│   ├── investigation/                       # バグ調査・技術調査ログ
│   ├── discussion/                          # ADR化前の議論
│   └── meetings/                            # ミーティングノート
│
├── docs/                                    # 🧠 設計・仕様（正本）
│   ├── 00_governance/
│   │   ├── operating-model.md               # 運用ルール（Docsゲート/PR/ブランチ等）
│   │   └── templates/
│   │       ├── adr-template.md
│   │       └── context-template.md
│   │
│   ├── 10_contexts/                         # bounded-context単位の設計（コードと1:1）
│   │   └── <ctx>/                           # 例: task / user ...
│   │       ├── _index.md                    # 入口（必須）
│   │       ├── context.md                   # 境界/責務/依存
│   │       ├── domain/
│   │       │   ├── model.md                 # 集約/Entity/VO
│   │       │   ├── rules.md                 # 不変条件/バリデーション
│   │       │   └── events.md                # ドメインイベント（必要なら）
│   │       ├── application/
│   │       │   └── use-cases.md             # コマンド/クエリ/入出力
│   │       ├── interfaces/
│   │       │   └── api.md                   # API契約
│   │       ├── data/
│   │       │   └── schema.md                # DBスキーマ/移行方針（Expand/Contract）
│   │       └── adr/                         # ctx固有ADR
│   │
│   └── 20_decisions/                        # 全体ADR（横断意思決定）
│       ├── adr-index.md
│       └── 2026-xx-xx-adr-0001.md
│
├── apps/                                    # 🚀 アプリケーション
│   ├── api/                                 # バックエンド（Hono + DDD）
│   │   ├── modules/                         # bounded-context実装
│   │   │   └── <ctx>/
│   │   │       ├── domain/
│   │   │       ├── application/
│   │   │       ├── infrastructure/
│   │   │       └── presentation/
│   │   │
│   │   ├── shared_kernel/                   # 🔒 Shared Kernel（API内共通）
│   │   │   ├── types/
│   │   │   ├── errors/
│   │   │   ├── ids/
│   │   │   ├── datetime/
│   │   │   └── utils/
│   │   │
│   │   ├── migrations/                      # DB移行（ctx単位）
│   │   │   └── <ctx>/
│   │   │
│   │   ├── tests/                           # テスト
│   │   │   ├── _shared/
│   │   │   │   ├── builders/
│   │   │   │   ├── fixtures/
│   │   │   │   ├── fakes/
│   │   │   │   ├── matchers/
│   │   │   │   └── testkit/
│   │   │   ├── <ctx>/
│   │   │   │   ├── unit/
│   │   │   │   │   ├── domain/
│   │   │   │   │   └── application/
│   │   │   │   ├── integration/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   ├── migrations/
│   │   │   │   │   └── external/
│   │   │   │   └── contract/
│   │   │   │       └── http/
│   │   │   └── e2e/
│   │   │       └── scenarios/
│   │   │
│   │   ├── tools/
│   │   │   └── architecture-tests/
│   │   ├── index.ts                         # エントリポイント
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── drizzle.config.ts
│   │
│   └── web/                                 # フロントエンド（Next.js）
│       ├── src/
│       │   ├── app/                         # App Router
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── tasks/
│       │   ├── components/                  # UIコンポーネント
│       │   │   ├── ui/                      # shadcn/ui コンポーネント
│       │   │   └── features/                # 機能単位コンポーネント
│       │   └── lib/                         # ユーティリティ・APIクライアント
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.ts
│
├── packages/                                # 📦 共有パッケージ
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
├── biome.json                               # 共通Lint/Format設定
├── CLAUDE.md
├── README.md
└── .gitignore
