import { GetAllUsersHandler } from "../../application/handlers/get-all-users-handler";
import { GetUserHandler } from "../../application/handlers/get-user-handler";
import { RegisterUserHandler } from "../../application/handlers/register-user-handler";
import { UpdateUserHandler } from "../../application/handlers/update-user-handler";
import { DrizzleUserRepository } from "./user-repository-impl";

export type UserContainer = ReturnType<typeof createUserContainer>;

export const createUserContainer = () => {
  const repository = new DrizzleUserRepository();
  return {
    registerUser: new RegisterUserHandler(repository),
    getUser: new GetUserHandler(repository),
    getAllUsers: new GetAllUsersHandler(repository),
    updateUser: new UpdateUserHandler(repository),
  };
};
