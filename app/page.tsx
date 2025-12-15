import { apiAdmin } from "@/lib/admin-api";

export default async function AdminPage() {
  const stats = await apiAdmin("stats");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
