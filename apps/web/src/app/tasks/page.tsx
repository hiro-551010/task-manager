import { tasksApi } from "@/lib/api/tasks";
import { TaskList } from "@/components/features/task/task-list";

export default async function TasksPage() {
  const tasks = await tasksApi.getAll();
  return <TaskList tasks={tasks} />;
}
