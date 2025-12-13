import { apiAdmin } from "@/lib/admin-api";

export default async function AdminDashboard() {
  const stats = await apiAdmin("stats");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Calls" value={stats.totalCalls} />
        <StatCard label="Revenue" value={`$${stats.totalRevenue}`} />
      </div>
    </div>
  );
}
