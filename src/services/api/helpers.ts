const MIN_DELAY = 90;
const MAX_DELAY = 260;

export function simulateLatency(): Promise<void> {
  const delay = Math.round(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

export function clone<T>(value: T): T {
  return structuredClone(value);
}

export function sortBy<T>(items: T[], selector: (item: T) => string): T[] {
  return [...items].sort((a, b) => selector(b).localeCompare(selector(a)));
}

export function nowISO(): string {
  return new Date().toISOString();
}
