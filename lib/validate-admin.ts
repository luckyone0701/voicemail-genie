import { redirect } from "next/navigation";

export async function validateAdmin() {
  const res = await fetch("/api/admin/auth/validate", {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!data.ok) {
    redirect("/login?admin=1");
  }

  return true;
}
