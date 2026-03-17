export type UserRegistered = {
  type: "UserRegistered";
  userId: string;
  email: string;
  occurredAt: Date;
};

export type UserDomainEvent = UserRegistered;
