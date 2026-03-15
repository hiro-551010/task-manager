import { ApplicationError } from "@/shared_kernel/errors";
import { User } from "../../domain/aggregates/user";
import { Email } from "../../domain/value-objects/email";
import type { UserRepository } from "../../domain/repositories/user-repository";
import type { Register } from "../commands/register";
import { type UserDto, toUserDto } from "../dtos/user-dto";

export class RegisterUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: Register): Promise<UserDto> {
    const email = Email.create(command.email);

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ApplicationError("user.email.duplicate", "このメールアドレスは既に使用されています");
    }

    const passwordHash = await Bun.password.hash(command.password);

    const user = User.create({
      name: command.name,
      email: command.email,
      passwordHash,
    });

    await this.userRepository.save(user);
    return toUserDto(user);
  }
}
