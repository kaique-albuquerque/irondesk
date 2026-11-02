import { DATABASE_KEY, DATABASE_VERSION } from '@/constants/app';
import type { CollectionKey, Database } from '@/interfaces/database.interface';
import { createSeedDatabase } from '@/services/mock/seed';
import { readStorage, removeStorage, writeStorage } from '@/services/storage/storage.service';

let cache: Database | null = null;

function isCurrent(database: Database | null): database is Database {
  return Boolean(database && database.version === DATABASE_VERSION && database.students);
}

export function getDatabase(): Database {
  if (isCurrent(cache)) return cache;
  const stored = readStorage<Database>(DATABASE_KEY);
  if (isCurrent(stored)) {
    cache = stored;
    return stored;
  }
  const seeded = createSeedDatabase();
  cache = seeded;
  writeStorage(DATABASE_KEY, seeded);
  return seeded;
}

export function setDatabase(database: Database): void {
  cache = database;
  writeStorage(DATABASE_KEY, database);
}

export function resetDatabase(): Database {
  removeStorage(DATABASE_KEY);
  cache = null;
  return getDatabase();
}

export function mutateDatabase<T>(mutator: (database: Database) => T): T {
  const database = getDatabase();
  const result = mutator(database);
  setDatabase(database);
  return result;
}

export function selectCollection<K extends CollectionKey>(key: K): Database[K] {
  return getDatabase()[key];
}
