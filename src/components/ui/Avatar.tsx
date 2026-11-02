import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<AvatarSize, string> = {
  sm: 'size-8 text-[11px]',
  md: 'size-9 text-xs',
  lg: 'size-14 text-base',
};

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent-ink ring-1 ring-accent/15',
        sizeClass[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
