import type { User } from "../../domain/aggregates/user";

export type UserDto = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export const toUserDto = (user: User): UserDto => ({
  id: user.id.value,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
