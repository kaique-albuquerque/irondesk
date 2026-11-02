import type { Plan } from '@/interfaces/plan.interface';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { studentStatusLabels, toOptions } from '@/constants/labels';
import type { StatusFilter } from '@/hooks/useStudentsDirectory';

interface StudentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  planFilter: string;
  onPlanFilterChange: (value: string) => void;
  plans: Plan[];
}

export function StudentsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  planFilter,
  onPlanFilterChange,
  plans,
}: StudentsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder="Buscar por nome, CPF, e-mail ou telefone"
        className="w-full sm:w-72"
      />
      <Select
        aria-label="Filtrar por status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
        options={[{ value: 'all', label: 'Todos os status' }, ...toOptions(studentStatusLabels)]}
        className="w-auto min-w-40"
      />
      <Select
        aria-label="Filtrar por plano"
        value={planFilter}
        onChange={(event) => onPlanFilterChange(event.target.value)}
        options={[
          { value: 'all', label: 'Todos os planos' },
          { value: 'none', label: 'Sem plano' },
          ...plans.map((plan) => ({ value: plan.id, label: plan.name })),
        ]}
        className="w-auto min-w-40"
      />
    </div>
  );
}
