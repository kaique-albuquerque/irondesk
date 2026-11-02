import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse', className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-surface-2/70">{children}</thead>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      className={cn('row-hover', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TH({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('table-head', className)} {...rest}>
      {children}
    </th>
  );
}

export function TD({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('table-cell', className)} {...rest}>
      {children}
    </td>
  );
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-1">{children}</div>;
}
