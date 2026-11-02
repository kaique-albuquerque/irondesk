import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneClass: Record<BadgeTone, string> = {
  accent: 'bg-accent-soft text-accent-ink ring-accent/20',
  success: 'bg-success/10 text-success ring-success/20',
  warning: 'bg-warning/10 text-warning ring-warning/20',
  danger: 'bg-danger/10 text-danger ring-danger/20',
  info: 'bg-info/10 text-info ring-info/20',
  neutral: 'bg-surface-3 text-muted ring-line-strong/40',
};

const dotClass: Record<BadgeTone, string> = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-subtle',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ tone = 'neutral', children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap',
        toneClass[tone],
        className,
      )}
    >
      {dot ? <span className={cn('size-1.5 rounded-full', dotClass[tone])} /> : null}
      {children}
    </span>
  );
}
