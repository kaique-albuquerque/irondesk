import { THEME_KEY } from '@/constants/app';
import type { ThemePreference } from '@/interfaces/settings.interface';
import { getDatabase, mutateDatabase } from '@/services/storage/database.service';
import { readStorage, writeStorage } from '@/services/storage/storage.service';

export function readTheme(): ThemePreference {
  const stored = readStorage<ThemePreference>(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return getDatabase().settings.theme;
}

export function applyTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  writeStorage(THEME_KEY, theme);
}

export function persistTheme(theme: ThemePreference): void {
  applyTheme(theme);
  mutateDatabase((database) => {
    database.settings.theme = theme;
  });
}

export function nextTheme(current: ThemePreference): ThemePreference {
  return current === 'dark' ? 'light' : 'dark';
}
