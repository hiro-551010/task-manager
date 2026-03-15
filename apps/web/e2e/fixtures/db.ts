import { Client } from "pg";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres:password@localhost:5433/taskdb_test";

export async function truncateTables(): Promise<void> {
  const client = new Client({ connectionString: TEST_DATABASE_URL });
  await client.connect();
  try {
    await client.query("TRUNCATE TABLE tasks RESTART IDENTITY CASCADE");
  } finally {
    await client.end();
  }
}
