import { ChangeTaskStatusHandler } from "../../application/handlers/change-task-status-handler";
import { CreateTaskHandler } from "../../application/handlers/create-task-handler";
import { DeleteTaskHandler } from "../../application/handlers/delete-task-handler";
import { GetAllTasksHandler } from "../../application/handlers/get-all-tasks-handler";
import { GetTaskHandler } from "../../application/handlers/get-task-handler";
import { UpdateTaskHandler } from "../../application/handlers/update-task-handler";
import { DrizzleTaskRepository } from "./task-repository-impl";

export type TaskContainer = ReturnType<typeof createTaskContainer>;

export const createTaskContainer = () => {
  const repository = new DrizzleTaskRepository();
  return {
    createTask: new CreateTaskHandler(repository),
    updateTask: new UpdateTaskHandler(repository),
    changeTaskStatus: new ChangeTaskStatusHandler(repository),
    deleteTask: new DeleteTaskHandler(repository),
    getTask: new GetTaskHandler(repository),
    getAllTasks: new GetAllTasksHandler(repository),
  };
};
