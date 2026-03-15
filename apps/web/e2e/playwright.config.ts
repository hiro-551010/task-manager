import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const TEST_DB_URL =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres:password@localhost:5433/taskdb_test";

// このファイルは apps/web/e2e/ にある
const webDir = path.join(__dirname, ".."); // apps/web/
const repoRoot = path.join(__dirname, "../../.."); // monorepo root

// すべての出力を e2e/ 配下に集約
const outputDir = __dirname; // apps/web/e2e/

export default defineConfig({
  testDir: ".",
  testMatch: ["smoke/**/*.spec.ts", "scenarios/**/*.spec.ts"],
  workers: 1, // テスト DB を共有するためシリアル実行
  outputDir: path.join(outputDir, "test-results"),
  reporter: [
    ["html", { outputFolder: path.join(outputDir, "playwright-report") }],
    ["./reporters/error-reporter.ts", { outputFile: path.join(outputDir, "error-report.json") }],
  ],
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: `DATABASE_URL="${TEST_DB_URL}" bun run --filter @task-manager/api dev`,
      cwd: repoRoot,
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: "NEXT_PUBLIC_API_URL=http://localhost:3000 bun run dev -- --port 4000",
      cwd: webDir,
      port: 4000,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
