import type { User } from "../aggregates/user";
import type { Email } from "../value-objects/email";
import type { UserId } from "../value-objects/user-id";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
}
