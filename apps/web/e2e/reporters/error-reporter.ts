import type { FullConfig, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import fs from "node:fs";
import path from "node:path";

interface ErrorEntry {
  page: string;
  type: string;
  message: string;
  stack: string;
  screenshot: string | null;
}

class ErrorReporter implements Reporter {
  private errors: ErrorEntry[] = [];
  private outputFile: string;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile = options.outputFile ?? "./error-report.json";
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === "failed" || result.status === "timedOut") {
      const page = this.extractPage(test.title);
      const screenshot =
        result.attachments.find((a) => a.name === "screenshot")?.path ?? null;

      for (const error of result.errors) {
        this.errors.push({
          page,
          type: result.status === "timedOut" ? "timeout" : "runtime_error",
          message: error.message ?? "Unknown error",
          stack: error.stack ?? "",
          screenshot,
        });
      }
      if (result.errors.length === 0) {
        this.errors.push({
          page,
          type: result.status === "timedOut" ? "timeout" : "test_failed",
          message: `Test "${test.title}" failed`,
          stack: "",
          screenshot,
        });
      }
    }
  }

  async onEnd(): Promise<void> {
    if (this.errors.length > 0) {
      const dir = path.dirname(this.outputFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.outputFile, JSON.stringify(this.errors, null, 2));
    }
  }

  private extractPage(title: string): string {
    const match = title.match(/https?:\/\/[^/]+(\/[^\s)]*)/);
    return match?.[1] ?? "/";
  }
}

export default ErrorReporter;
