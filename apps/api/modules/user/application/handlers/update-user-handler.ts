import { ApplicationError } from "@/shared_kernel/errors";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { UserId } from "../../domain/value-objects/user-id";
import type { UpdateProfile } from "../commands/update-profile";
import { type UserDto, toUserDto } from "../dtos/user-dto";

export class UpdateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: UpdateProfile): Promise<UserDto> {
    const user = await this.userRepository.findById(UserId.reconstruct(command.id));
    if (!user) {
      throw new ApplicationError("user.not_found", `ユーザーが見つかりません: ${command.id}`);
    }
    if (command.name !== undefined) {
      user.updateName(command.name);
    }
    await this.userRepository.save(user);
    return toUserDto(user);
  }
}
