import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { formatNumber } from '@/utils/format';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
      <p className="text-xs text-muted">
        Exibindo <span className="font-medium text-ink">{formatNumber(from)}</span>–
        <span className="font-medium text-ink">{formatNumber(to)}</span> de{' '}
        <span className="font-medium text-ink">{formatNumber(total)}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          icon={<ChevronLeft className="size-4" />}
        >
          Anterior
        </Button>
        <span className="text-xs text-muted">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Próxima
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
