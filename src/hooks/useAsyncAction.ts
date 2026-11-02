import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/utils/errors';

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<unknown>,
): {
  run: (...args: TArgs) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        await action(...args);
        return true;
      } catch (caught) {
        setError(toErrorMessage(caught));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { run, loading, error, clearError: () => setError(null) };
}
