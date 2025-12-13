import { validateAdmin } from "@/lib/validate-admin";
import Sidebar from "@/components/admin/sidebar";

export default async function AdminLayout({ children }) {
  await validateAdmin(); // redirects if not admin

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
