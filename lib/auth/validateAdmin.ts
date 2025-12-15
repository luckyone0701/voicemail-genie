import { redirect } from "next/navigation";

export async function validateAdmin() {
  // TODO: replace with real auth logic
  const isAdmin = false;

  if (!isAdmin) {
    redirect("/");
  }
}
