import { useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import type { Plan } from '@/interfaces/plan.interface';
import { plansService } from '@/services/api/plans.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CardsSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PlanCard } from '@/components/plans/PlanCard';
import { PlanFormModal } from '@/components/plans/PlanFormModal';

export function PlansPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(async () => {
    const [plans, counts] = await Promise.all([plansService.list(), Promise.resolve(plansService.countStudents())]);
    return { plans, counts };
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [deleting, setDeleting] = useState<Plan | null>(null);

  const { run: togglePlan } = useAsyncAction(async (plan: Plan) => plansService.toggleStatus(plan.id));
  const { run: removePlan, loading: removing } = useAsyncAction(async (plan: Plan) =>
    plansService.remove(plan.id),
  );

  const plans = data?.plans ?? [];
  const counts = data?.counts ?? {};

  const handleToggle = async (plan: Plan) => {
    const success = await togglePlan(plan);
    if (!success) return;
    toast(plan.status === 'active' ? 'Plano desativado' : 'Plano ativado', { description: plan.name });
    await reload();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const success = await removePlan(deleting);
    if (!success) {
      toast('Não foi possível excluir', {
        description: 'Planos com matrículas ativas precisam ser desativados em vez de excluídos.',
        tone: 'error',
      });
      return;
    }
    toast('Plano removido', { description: deleting.name });
    setDeleting(null);
    await reload();
  };

  const activeCount = plans.filter((plan) => plan.status === 'active').length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Planos"
        description={`${plans.length} planos cadastrados · ${activeCount} ativos`}
        actions={
          <Button
            icon={<Plus className="size-4" />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Novo plano
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <CardsSkeleton count={3} />
        </div>
      ) : plans.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={<Tags className="size-5" />}
            title="Nenhum plano cadastrado"
            description="Crie o primeiro plano para começar a vender matrículas."
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              students={counts[plan.id] ?? 0}
              onEdit={() => {
                setEditing(plan);
                setFormOpen(true);
              }}
              onToggle={() => void handleToggle(plan)}
              onDelete={() => setDeleting(plan)}
            />
          ))}
        </div>
      )}

      <PlanFormModal open={formOpen} plan={editing} onClose={() => setFormOpen(false)} onSaved={reload} />

      <ConfirmDialog
        open={!!deleting}
        loading={removing}
        title="Excluir plano"
        description={`O plano ${deleting?.name ?? ''} será removido. Planos com matrículas ativas não podem ser excluídos.`}
        confirmLabel="Excluir plano"
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
