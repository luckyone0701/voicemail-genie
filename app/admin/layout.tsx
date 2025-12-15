import { ReactNode } from "react";
import Sidebar from "@/components/admin/sidebar";
import { validateAdmin } from "@/lib/auth/validateAdmin";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await validateAdmin();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
