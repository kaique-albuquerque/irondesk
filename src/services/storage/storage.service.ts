function isAvailable(): boolean {
  try {
    const probe = '__irondesk_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export const storageAvailable = typeof window !== 'undefined' && isAvailable();

const memory = new Map<string, string>();

export function readStorage<T>(key: string): T | null {
  try {
    const raw = storageAvailable ? window.localStorage.getItem(key) : memory.get(key) ?? null;
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);
  if (storageAvailable) {
    window.localStorage.setItem(key, raw);
    return;
  }
  memory.set(key, raw);
}

export function removeStorage(key: string): void {
  if (storageAvailable) {
    window.localStorage.removeItem(key);
    return;
  }
  memory.delete(key);
}
