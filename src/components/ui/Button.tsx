import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-110 active:brightness-95 shadow-sm',
  secondary: 'bg-surface-3 text-ink hover:bg-line/70',
  ghost: 'text-muted hover:bg-surface-2 hover:text-ink',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20 ring-1 ring-inset ring-danger/25',
  outline: 'border border-line-strong text-ink hover:bg-surface-2',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'size-9 justify-center',
};

export const buttonBase =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonBase, variantClass[variant], sizeClass[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
