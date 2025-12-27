import { useAuthStore } from '../features/auth/store/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = useAuthStore();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (auth.user?.token) {
    headers.set('Authorization', `Bearer ${auth.user.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' })
};
