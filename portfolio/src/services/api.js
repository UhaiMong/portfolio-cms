import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

const memory = new Map();
const TTL_MS = 5 * 60 * 1000;

export const cachedGet = async (url, params, { ttl = TTL_MS, key } = {}) => {
  const cacheKey = key || `${url}?${JSON.stringify(params || {})}`;
  const hit = memory.get(cacheKey);
  if (hit && Date.now() - hit.at < ttl) return hit.data;

  try {
    const stored = sessionStorage.getItem(`pcache:${cacheKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.at < ttl) {
        memory.set(cacheKey, parsed);
        return parsed.data;
      }
    }
  } catch {
    /* private mode / quota */
  }

  const res = await api.get(url, { params });
  const payload = { at: Date.now(), data: res.data.data ?? res.data };
  memory.set(cacheKey, payload);
  try {
    sessionStorage.setItem(`pcache:${cacheKey}`, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
  return payload.data;
};

export default api;
