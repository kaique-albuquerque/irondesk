import { cn } from '@/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, description, disabled, className }: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-4',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
    >
      {label || description ? (
        <span className="min-w-0">
          {label ? <span className="block text-sm font-medium text-ink">{label}</span> : null}
          {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
        </span>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'Alternar'}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-line-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  );
}
