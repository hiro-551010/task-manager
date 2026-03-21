import type { Session } from "../aggregates/session";
import type { SessionId } from "../value-objects/session-id";

export interface SessionRepository {
  findById(id: SessionId): Promise<Session | null>;
  save(session: Session): Promise<void>;
  delete(id: SessionId): Promise<void>;
}
