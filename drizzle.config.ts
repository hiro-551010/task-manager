import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./modules/*/infrastructure/persistence/schema.ts",
  out: "./migrations/task",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
