/**
 * Tiny safe wrappers around Web Storage.
 * Everything is guarded so SSR and privacy modes never throw.
 */

export function readJSON<T>(storage: "local" | "session", key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(storage: "local" | "session", key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state simply won't persist */
  }
}

export function removeKey(storage: "local" | "session", key: string): void {
  if (typeof window === "undefined") return;
  try {
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    store.removeItem(key);
  } catch {
    /* ignore */
  }
}
