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
│   │   └── <ctx>/                           # 例: audio / billing / identity ...
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
├── modules/                                 # 💻 実装（bounded-context単位）
│   └── <ctx>/
│       ├── domain/                          # 外部依存なし（純粋ドメイン）
│       │   ├── aggregates/
│       │   ├── entities/
│       │   ├── value-objects/
│       │   ├── services/
│       │   ├── events/
│       │   └── repositories/                # IFのみ（実装はinfra）
│       │
│       ├── application/                     # ユースケース（オーケストレーション）
│       │   ├── commands/
│       │   ├── queries/
│       │   ├── handlers/
│       │   ├── dtos/
│       │   └── policies/
│       │
│       ├── infrastructure/                  # DB/外部API/Queueなど
│       │   ├── persistence/                 # repository実装
│       │   ├── external/                    # 外部サービスAdapter
│       │   ├── messaging/                   # outbox, publisherなど
│       │   └── configs/
│       │
│       └── presentation/                    # 入口（種類で分ける）
│           ├── http/                        # REST/Controllers/Routes/Validators
│           ├── messaging/                   # consumer/subscriber/webhook等
│           └── jobs/                        # batch/cron/worker
│
├── shared_kernel/                           # 🔒 Shared Kernel（“共通ゴミ箱化”防止）
│   ├── types/
│   ├── errors/
│   ├── ids/
│   ├── datetime/
│   └── utils/                               # “薄い汎用”のみ（ドメイン知識禁止）
│
├── migrations/                              # 🗄️ DB移行（ctx単位で標準化）
│   └── <ctx>/
│       ├── 0001_init.sql
│       ├── 0002_expand_add_x.sql
│       └── 0003_contract_drop_y.sql
│
├── tests/                                   # ✅ テスト（ctx別が基本）
│   ├── _shared/                             # テスト専用共通（shared_kernelとは別）
│   │   ├── builders/
│   │   ├── fixtures/
│   │   ├── fakes/
│   │   ├── matchers/
│   │   └── testkit/
│   │
│   ├── <ctx>/
│   │   ├── unit/
│   │   │   ├── domain/
│   │   │   └── application/
│   │   ├── integration/
│   │   │   ├── persistence/
│   │   │   ├── migrations/
│   │   │   └── external/
│   │   └── contract/
│   │       └── http/                        # HTTPリクエスト/レスポンス/status/validation
│   │
│   └── e2e/                                 # クリティカルパスのみ（少数）
│       └── scenarios/
│
├── tools/
│   └── architecture-tests/                  # 依存ルール違反をCIで落とす
│       ├── README.md
│       └── check-deps.(sh|ps1|js|py)         # 言語に合わせて実装
│
├── scripts/                                 # 補助スクリプト（ローカル作業/CI補助）
│
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml
│
├── CLAUDE.md                                # Claude Code向けの最小運用ルール
├── README.md
└── .gitignore