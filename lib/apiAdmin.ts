// lib/apiAdmin.ts
export async function apiAdmin<T = any>(path: string): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL / VERCEL_URL");
  }

  const res = await fetch(`${baseUrl}/api/admin/${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Admin API error: ${res.status}`);
  }

  return res.json();
}
