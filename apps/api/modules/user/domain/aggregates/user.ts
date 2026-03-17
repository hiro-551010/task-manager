import type { UserDomainEvent } from "../events";
import { Email } from "../value-objects/email";
import { PasswordHash } from "../value-objects/password-hash";
import { UserId } from "../value-objects/user-id";
import { UserName } from "../value-objects/user-name";

export class User {
  private _domainEvents: UserDomainEvent[] = [];

  private constructor(
    readonly id: UserId,
    private _name: UserName,
    private _email: Email,
    private _passwordHash: PasswordHash,
    readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(params: { name: string; email: string; passwordHash: string }): User {
    const now = new Date();
    const user = new User(
      UserId.generate(),
      UserName.create(params.name),
      Email.create(params.email),
      PasswordHash.reconstruct(params.passwordHash),
      now,
      now,
    );
    user._domainEvents.push({
      type: "UserRegistered",
      userId: user.id.value,
      email: user._email.value,
      occurredAt: now,
    });
    return user;
  }

  static reconstruct(params: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      UserId.reconstruct(params.id),
      UserName.create(params.name),
      Email.create(params.email),
      PasswordHash.reconstruct(params.passwordHash),
      params.createdAt,
      params.updatedAt,
    );
  }

  get name(): string {
    return this._name.value;
  }

  get email(): string {
    return this._email.value;
  }

  get passwordHash(): string {
    return this._passwordHash.value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get domainEvents(): UserDomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  updateName(name: string): void {
    this._name = UserName.create(name);
    this._updatedAt = new Date();
  }
}
