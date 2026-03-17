import { eq } from "drizzle-orm";
import { InfrastructureError } from "@/shared_kernel/errors";
import { Session } from "../../domain/aggregates/session";
import type { SessionRepository } from "../../domain/repositories/session-repository";
import { SessionId } from "../../domain/value-objects/session-id";
import { db } from "./db";
import { sessions } from "./schema";

export class DrizzleSessionRepository implements SessionRepository {
  async findById(id: SessionId): Promise<Session | null> {
    try {
      const records = await db.select().from(sessions).where(eq(sessions.id, id.value)).limit(1);
      if (records.length === 0) return null;
      const r = records[0];
      return Session.reconstruct({ id: r.id, userId: r.userId, createdAt: r.createdAt });
    } catch (error) {
      throw new InfrastructureError("auth.db.find_failed", "セッションの取得に失敗しました", error);
    }
  }

  async save(session: Session): Promise<void> {
    try {
      await db.insert(sessions).values({
        id: session.id.value,
        userId: session.userId,
        createdAt: session.createdAt,
      });
    } catch (error) {
      throw new InfrastructureError("auth.db.save_failed", "セッションの保存に失敗しました", error);
    }
  }

  async delete(id: SessionId): Promise<void> {
    try {
      await db.delete(sessions).where(eq(sessions.id, id.value));
    } catch (error) {
      throw new InfrastructureError(
        "auth.db.delete_failed",
        "セッションの削除に失敗しました",
        error,
      );
    }
  }
}
