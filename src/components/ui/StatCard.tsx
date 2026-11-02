import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { AccentTone } from '@/constants/tones';
import { accentBgSoft, accentText } from '@/constants/tones';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: AccentTone;
  trend?: { value: number; label?: string };
  className?: string;
}

export function StatCard({ label, value, hint, icon, tone = 'accent', trend, className }: StatCardProps) {
  const positive = (trend?.value ?? 0) >= 0;

  return (
    <div className={cn('panel p-5 shadow-panel', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        <span className={cn('flex size-9 items-center justify-center rounded-lg', accentBgSoft[tone], accentText[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink tnum">{value}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        {trend ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              positive ? 'text-success' : 'text-danger',
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(trend.value).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
          </span>
        ) : null}
        {trend?.label ? <span className="text-xs text-subtle">{trend.label}</span> : null}
        {!trend && hint ? <span className="text-xs text-subtle">{hint}</span> : null}
      </div>
    </div>
  );
}
