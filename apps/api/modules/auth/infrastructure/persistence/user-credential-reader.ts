import { sql } from "drizzle-orm";
import { InfrastructureError } from "@/shared_kernel/errors";
import type { UserCredentialPort, UserCredential } from "../../application/ports/user-credential-port";
import { db } from "./db";

type RawRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

function toCredential(row: RawRow): UserCredential {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class DrizzleUserCredentialReader implements UserCredentialPort {
  async findByEmail(email: string): Promise<UserCredential | null> {
    try {
      const result = await db.execute(
        sql`SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ${email} LIMIT 1`,
      );
      if (result.rows.length === 0) return null;
      return toCredential(result.rows[0] as RawRow);
    } catch (error) {
      throw new InfrastructureError(
        "auth.db.credential_find_failed",
        "ユーザー情報の取得に失敗しました",
        error,
      );
    }
  }

  async findById(id: string): Promise<UserCredential | null> {
    try {
      const result = await db.execute(
        sql`SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE id = ${id} LIMIT 1`,
      );
      if (result.rows.length === 0) return null;
      return toCredential(result.rows[0] as RawRow);
    } catch (error) {
      throw new InfrastructureError(
        "auth.db.credential_find_failed",
        "ユーザー情報の取得に失敗しました",
        error,
      );
    }
  }
}
