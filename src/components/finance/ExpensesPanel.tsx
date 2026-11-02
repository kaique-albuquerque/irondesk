import { useMemo, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import type { Expense } from '@/interfaces/payment.interface';
import { expensesService } from '@/services/api/expenses.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ExpensesTable } from '@/components/finance/ExpensesTable';
import { ExpenseFormModal } from '@/components/finance/ExpenseFormModal';
import { expenseCategoryOptions } from '@/constants/labels';

interface ExpensesPanelProps {
  expenses: Expense[];
  loading: boolean;
  onChange: () => void;
}

export function ExpensesPanel({ expenses, loading, onChange }: ExpensesPanelProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const debounced = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesTerm = !term || expense.description.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || expense.category === category;
      return matchesTerm && matchesCategory;
    });
  }, [expenses, debounced, category]);

  const { run, loading: removing } = useAsyncAction(async (expense: Expense) => {
    await expensesService.remove(expense.id);
  });

  const handleDelete = async () => {
    if (!deleting) return;
    const success = await run(deleting);
    if (!success) return;
    toast('Despesa removida', { description: deleting.description });
    setDeleting(null);
    onChange();
  };

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Buscar despesa"
          className="w-full sm:w-64"
        />
        <Select
          aria-label="Filtrar por categoria"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          options={[{ value: 'all', label: 'Todas as categorias' }, ...expenseCategoryOptions]}
          className="w-auto min-w-44"
        />
        <Button
          className="ml-auto"
          variant="outline"
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Nova despesa
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Wallet className="size-5" />}
          title="Nenhuma despesa encontrada"
          description="Registre custos como aluguel, folha de pagamento e manutenção."
        />
      ) : (
        <ExpensesTable
          expenses={filtered}
          onEdit={(expense) => {
            setEditing(expense);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      )}

      <ExpenseFormModal open={formOpen} expense={editing} onClose={() => setFormOpen(false)} onSaved={onChange} />
      <ConfirmDialog
        open={!!deleting}
        loading={removing}
        title="Excluir despesa"
        description={`"${deleting?.description ?? ''}" será removida permanentemente.`}
        confirmLabel="Excluir"
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />

      {category !== 'all' ? (
        <div className="border-t border-line px-4 py-2 text-[11px] text-subtle">
          Filtro ativo: {expenseCategoryOptions.find((option) => option.value === category)?.label ?? 'Todas'}
        </div>
      ) : null}
    </div>
  );
}
