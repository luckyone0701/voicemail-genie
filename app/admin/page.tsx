export const dynamic = "force-dynamic";

import { apiAdmin } from "@/lib/apiAdmin";

export default async function AdminPage() {
  const stats = await apiAdmin("stats");

  return (
    <div>
      {/* admin UI */}
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
