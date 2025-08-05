export const API_BASE = (import.meta.env.VITE_API_BASE as string) ?? 'http://localhost:8000';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) throw new Error(res.statusText);
  return (await res.json()) as T;
}
