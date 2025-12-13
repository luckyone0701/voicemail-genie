export async function apiAdmin(path: string, options: RequestInit = {}) {
  const res = await fetch(`/api/admin/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
  });

  if (!res.ok) {
    throw new Error(`Admin API error: ${res.status}`);
  }

  return res.json();
}
