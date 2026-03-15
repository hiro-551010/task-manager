import { usersApi } from "@/lib/api/users";
import { UserList } from "@/components/features/user/user-list";

export default async function UsersPage() {
  try {
    const users = await usersApi.getAll();
    return <UserList users={users} />;
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">APIに接続できませんでした</p>
          <p className="mt-1 text-red-500">{message}</p>
        </div>
      </div>
    );
  }
}
