import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastMessage, ToastTone } from '@/types/toast';
import { cn } from '@/utils/cn';
import { createId } from '@/utils/id';

export interface ToastApi {
  toast: (title: string, options?: { description?: string; tone?: ToastTone }) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

const toneStyles: Record<ToastTone, { icon: ReactNode; accent: string }> = {
  success: { icon: <CheckCircle2 className="size-4" />, accent: 'text-success' },
  error: { icon: <AlertCircle className="size-4" />, accent: 'text-danger' },
  info: { icon: <Info className="size-4" />, accent: 'text-info' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      toast: (title, options) => {
        const id = createId('toast');
        setMessages((current) => [
          ...current,
          { id, title, description: options?.description, tone: options?.tone ?? 'success' },
        ]);
        window.setTimeout(() => dismiss(id), 4200);
      },
    }),
    [dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-panel animate-[toast-in_160ms_ease-out]"
          >
            <span className={cn('mt-0.5', toneStyles[message.tone].accent)}>{toneStyles[message.tone].icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{message.title}</p>
              {message.description ? (
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{message.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(message.id)}
              aria-label="Fechar notificação"
              className="rounded-md p-1 text-subtle transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
