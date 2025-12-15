export async function apiAdmin(path: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Admin API failed: ${path}`);
  }

  return res.json();
}
