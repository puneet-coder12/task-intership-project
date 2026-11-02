const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path = '', options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/tasks${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the API is running.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => request(),
  create: (task) => request('', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, patch) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(patch) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
