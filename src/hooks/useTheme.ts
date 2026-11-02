import { useContext } from 'react';
import { ThemeContext } from '@/components/layout/ThemeProvider';
import type { ThemeContextValue } from '@/components/layout/ThemeProvider';

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme precisa ser usado dentro de ThemeProvider.');
  return context;
}
