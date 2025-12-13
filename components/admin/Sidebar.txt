// components/admin/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Admin</h2>

      <nav className="space-y-4">
        <Link href="/admin" className="block hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/users" className="block hover:underline">
          Users
        </Link>
        <Link href="/admin/payments" className="block hover:underline">
          Payments
        </Link>
      </nav>
    </aside>
  );
}
