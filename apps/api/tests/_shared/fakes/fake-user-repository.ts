import type { User } from "@/modules/user/domain/aggregates/user";
import type { Email } from "@/modules/user/domain/value-objects/email";
import type { UserId } from "@/modules/user/domain/value-objects/user-id";
import type { UserRepository } from "@/modules/user/domain/repositories/user-repository";

export class FakeUserRepository implements UserRepository {
  private store = new Map<string, User>();

  async findById(id: UserId): Promise<User | null> {
    return this.store.get(id.value) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email === email.value) return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return [...this.store.values()];
  }

  async save(user: User): Promise<void> {
    this.store.set(user.id.value, user);
  }
}
