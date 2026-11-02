import { useMemo, useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Employee } from '@/interfaces/employee.interface';
import { employeesService } from '@/services/api/employees.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmployeesTable } from '@/components/team/EmployeesTable';
import { EmployeeFormModal } from '@/components/team/EmployeeFormModal';
import { employeeRoleOptions } from '@/constants/labels';
import type { EmployeeRole } from '@/interfaces/employee.interface';

export function TeamPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(() => employeesService.list(), []);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<EmployeeRole | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [removing, setRemoving] = useState<Employee | null>(null);
  const { run: removeEmployee, loading: removingLoading } = useAsyncAction(employeesService.remove);

  const employees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((employee) => {
      const matchesRole = role === 'all' || employee.role === role;
      const matchesTerm =
        !term ||
        employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.phone.includes(term);
      return matchesRole && matchesTerm;
    });
  }, [data, role, search]);

  const handleDelete = async () => {
    if (!removing) return;
    const success = await removeEmployee(removing.id);
    if (success) {
      toast('Colaborador removido', { description: removing.name, tone: 'error' });
      reload();
    }
    setRemoving(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipe"
        description="Professores, personal trainers e recepção com contatos e status de acesso."
        actions={
          <Button
            icon={<UserPlus className="size-4" />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Novo colaborador
          </Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar por nome, e-mail ou telefone"
            className="sm:max-w-sm"
          />
          <Select
            className="sm:w-52"
            value={role}
            onChange={(event) => setRole(event.target.value as EmployeeRole | 'all')}
            options={[{ value: 'all', label: 'Todas as funções' }, ...employeeRoleOptions]}
          />
          <span className="text-xs text-muted sm:ml-auto tnum">
            {employees.length} {(data ?? []).length === 1 ? 'colaborador' : 'colaboradores'}
          </span>
        </div>
      </Card>

      {loading && !data ? (
        <TableSkeleton rows={5} />
      ) : employees.length === 0 ? (
        <EmptyState
          title="Nenhum colaborador encontrado"
          description="Ajuste os filtros ou cadastre um novo membro para a equipe."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Cadastrar colaborador
            </Button>
          }
        />
      ) : (
        <EmployeesTable
          employees={employees}
          onEdit={(employee) => {
            setEditing(employee);
            setFormOpen(true);
          }}
          onDelete={setRemoving}
        />
      )}

      <EmployeeFormModal
        open={formOpen}
        employee={editing}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        title="Remover colaborador"
        description={`Tem certeza que deseja remover ${removing?.name ?? ''} da equipe?`}
        confirmLabel="Remover"
        tone="danger"
        loading={removingLoading}
        onConfirm={handleDelete}
        onClose={() => setRemoving(null)}
      />
    </div>
  );
}
