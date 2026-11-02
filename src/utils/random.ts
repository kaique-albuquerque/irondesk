let seed = 20260214;

export function resetRandom(value = 20260214): void {
  seed = value;
}

export function random(): number {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function randomPick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

export function randomChance(probability: number): boolean {
  return random() < probability;
}

export function randomDecimal(min: number, max: number, digits = 1): number {
  const value = random() * (max - min) + min;
  return Number(value.toFixed(digits));
}
