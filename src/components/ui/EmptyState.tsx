import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-3 text-subtle">
        {icon ?? <Inbox className="size-5" />}
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
