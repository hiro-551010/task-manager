import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./modules/auth/infrastructure/persistence/schema.ts",
  out: "./migrations/auth",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
