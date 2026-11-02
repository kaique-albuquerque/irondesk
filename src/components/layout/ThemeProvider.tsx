import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThemePreference } from '@/interfaces/settings.interface';
import { nextTheme, persistTheme, readTheme } from '@/services/api/theme.service';

export interface ThemeContextValue {
  theme: ThemePreference;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => readTheme());

  useEffect(() => {
    persistTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setThemeState((current) => nextTheme(current)), []);
  const setTheme = useCallback((value: ThemePreference) => setThemeState(value), []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, isDark: theme === 'dark', toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
