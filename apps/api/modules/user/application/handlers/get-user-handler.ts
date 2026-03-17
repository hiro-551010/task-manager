import { ApplicationError } from "@/shared_kernel/errors";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { UserId } from "../../domain/value-objects/user-id";
import type { Get } from "../queries/get";
import { type UserDto, toUserDto } from "../dtos/user-dto";

export class GetUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: Get): Promise<UserDto> {
    const user = await this.userRepository.findById(UserId.reconstruct(query.id));
    if (!user) {
      throw new ApplicationError("user.not_found", `ユーザーが見つかりません: ${query.id}`);
    }
    return toUserDto(user);
  }
}
