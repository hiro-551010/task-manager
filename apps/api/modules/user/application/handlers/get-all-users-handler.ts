import type { UserRepository } from "../../domain/repositories/user-repository";
import { type UserDto, toUserDto } from "../dtos/user-dto";

export class GetAllUsersHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(toUserDto);
  }
}
