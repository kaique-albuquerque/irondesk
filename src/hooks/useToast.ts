import { useContext } from 'react';
import { ToastContext } from '@/components/ui/ToastProvider';
import type { ToastApi } from '@/components/ui/ToastProvider';

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast precisa ser usado dentro de ToastProvider.');
  return context;
}
