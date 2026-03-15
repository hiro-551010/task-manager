import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./modules/user/infrastructure/persistence/schema.ts",
  out: "./migrations/user",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
