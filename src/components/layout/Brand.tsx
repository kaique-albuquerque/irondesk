import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BrandProps {
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Brand({ compact = false, className, onClick }: BrandProps) {
  return (
    <Link to="/" onClick={onClick} className={cn('flex items-center gap-2.5', className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-sm">
        <Dumbbell className="size-5" strokeWidth={2.4} />
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-sm font-semibold tracking-tight text-ink">IronDesk</span>
          <span className="block text-[10px] tracking-[0.14em] text-subtle uppercase">Gestão fitness</span>
        </span>
      ) : null}
    </Link>
  );
}
