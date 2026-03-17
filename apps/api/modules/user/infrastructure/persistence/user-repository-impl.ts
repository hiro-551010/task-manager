import { eq } from "drizzle-orm";
import { InfrastructureError } from "@/shared_kernel/errors";
import { User } from "../../domain/aggregates/user";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { Email } from "../../domain/value-objects/email";
import { UserId } from "../../domain/value-objects/user-id";
import { db } from "./db";
import { users } from "./schema";

export class DrizzleUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User | null> {
    try {
      const records = await db.select().from(users).where(eq(users.id, id.value)).limit(1);
      if (records.length === 0) return null;
      return this.toDomain(records[0]);
    } catch (error) {
      throw new InfrastructureError("user.db.find_failed", "ユーザーの取得に失敗しました", error);
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const records = await db.select().from(users).where(eq(users.email, email.value)).limit(1);
      if (records.length === 0) return null;
      return this.toDomain(records[0]);
    } catch (error) {
      throw new InfrastructureError(
        "user.db.find_by_email_failed",
        "ユーザーの取得に失敗しました",
        error,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const records = await db.select().from(users).orderBy(users.createdAt);
      return records.map((r) => this.toDomain(r));
    } catch (error) {
      throw new InfrastructureError(
        "user.db.find_all_failed",
        "ユーザー一覧の取得に失敗しました",
        error,
      );
    }
  }

  async save(user: User): Promise<void> {
    try {
      await db
        .insert(users)
        .values({
          id: user.id.value,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            name: user.name,
            updatedAt: user.updatedAt,
          },
        });
    } catch (error) {
      throw new InfrastructureError("user.db.save_failed", "ユーザーの保存に失敗しました", error);
    }
  }

  private toDomain(record: typeof users.$inferSelect): User {
    return User.reconstruct({
      id: record.id,
      name: record.name,
      email: record.email,
      passwordHash: record.passwordHash,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
