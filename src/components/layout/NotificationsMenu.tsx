import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff } from 'lucide-react';
import { buildNotifications } from '@/hooks/useNotificationsData';
import { cn } from '@/utils/cn';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const items = useMemo(() => buildNotifications(), []);
  const toneStyles = {
    error: 'bg-danger',
    info: 'bg-info',
    success: 'bg-success',
  } as const;

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notificações"
        aria-expanded={open}
        className="relative flex size-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition-colors hover:text-ink"
      >
        <Bell className="size-4" />
        {items.length > 0 ? (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-fg">
            {items.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute top-full right-0 z-40 mt-1 w-80 overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="text-xs font-semibold text-ink">Notificações</p>
            <span className="text-[11px] text-subtle">{items.length} pendências</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <BellOff className="size-5 text-subtle" />
                <p className="text-xs text-muted">Tudo em ordem por aqui.</p>
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={`${item.id}-${item.title}`}
                  type="button"
                  onClick={() => {
                    navigate(item.to);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-2.5 border-b border-line px-4 py-2.5 text-left last:border-0 hover:bg-surface-2"
                >
                  <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', toneStyles[item.tone])} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-ink">{item.title}</span>
                    <span className="block truncate text-[11px] text-subtle">{item.description}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
