import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { muscleGroupOptions } from '@/constants/labels';

interface WorkoutsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  muscleGroup: string;
  onMuscleGroupChange: (value: string) => void;
  total: number;
}

export function WorkoutsToolbar({
  search,
  onSearchChange,
  muscleGroup,
  onMuscleGroupChange,
  total,
}: WorkoutsToolbarProps) {
  const groupLabel =
    muscleGroup === 'all'
      ? ''
      : ` · ${muscleGroupOptions.find((option) => option.value === muscleGroup)?.label ?? ''}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder="Buscar por aluno ou ficha"
        className="w-full sm:w-80"
      />
      <Select
        aria-label="Filtrar por grupo muscular"
        value={muscleGroup}
        onChange={(event) => onMuscleGroupChange(event.target.value)}
        options={[{ value: 'all', label: 'Todos os grupos' }, ...muscleGroupOptions]}
        className="w-auto min-w-44"
      />
      <span className="ml-auto text-xs text-subtle">
        {total} {total === 1 ? 'ficha' : 'fichas'}
        {groupLabel}
      </span>
    </div>
  );
}
