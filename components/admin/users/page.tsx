type User = {
  id: string;
  email: string;
  plan: string;
  createdAt?: string;
};

import { apiAdmin } from "@/lib/admin-api";

export default async function UsersPage() {
  const users: User[] = await apiAdmin("users");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Plan</th>
            <th className="border p-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: User) => (
            <tr key={u.id}>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.plan}</td>
              <td className="border p-2">{u.createdAt ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
