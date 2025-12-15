export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await apiAdmin("stats");

  return (
    <div>
      {/* admin UI */}
    </div>
  );
}
