import { cn } from '@/utils/cn';

export interface TabItem<TValue extends string = string> {
  value: TValue;
  label: string;
  count?: number;
}

interface TabsProps<TValue extends string> {
  items: TabItem<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
}

export function Tabs<TValue extends string>({ items, value, onChange, className }: TabsProps<TValue>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1 rounded-lg bg-surface-2 p-1', className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              active ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] tnum',
                  active ? 'bg-accent-soft text-accent-ink' : 'bg-surface-3 text-subtle',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
