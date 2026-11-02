import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { enrollmentStatusLabels, toOptions } from '@/constants/labels';

const statusOptions = [{ value: 'all', label: 'Todas as situações' }, ...toOptions(enrollmentStatusLabels)];

interface EnrollmentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  total: number;
  busy?: boolean;
}

export function EnrollmentsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  total,
  busy,
}: EnrollmentsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder="Buscar por aluno"
        className="w-full sm:w-72"
      />
      <Select
        aria-label="Filtrar por situação"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        options={statusOptions}
        className="w-auto min-w-44"
      />
      <span className="ml-auto text-xs text-subtle">
        {busy ? 'Processando...' : `${total} matrículas`}
      </span>
    </div>
  );
}
