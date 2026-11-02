import { Check, MoreHorizontal, Pencil, Power, Sparkles, Trash2, Users } from 'lucide-react';
import type { Plan } from '@/interfaces/plan.interface';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { billingCycleLabels, planStatusLabels } from '@/constants/labels';
import { planStatusTone } from '@/constants/status';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface PlanCardProps {
  plan: Plan;
  students: number;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function PlanCard({ plan, students, onEdit, onToggle, onDelete }: PlanCardProps) {
  return (
    <article className={cn('panel flex flex-col p-5 shadow-panel', plan.highlighted && 'ring-1 ring-accent/40')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-ink">{plan.name}</h2>
            {plan.highlighted ? (
              <Badge tone="accent">
                <Sparkles className="size-3" /> Recomendado
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{plan.description}</p>
        </div>
        <Dropdown
          trigger={
            <span className="inline-flex size-8 items-center justify-center rounded-lg text-subtle hover:bg-surface-2 hover:text-ink">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Ações do plano {plan.name}</span>
            </span>
          }
          items={[
            { label: 'Editar plano', icon: <Pencil className="size-3.5" />, onClick: onEdit },
            {
              label: plan.status === 'active' ? 'Desativar' : 'Ativar',
              icon: <Power className="size-3.5" />,
              onClick: onToggle,
            },
            { label: 'Excluir', icon: <Trash2 className="size-3.5" />, danger: true, onClick: onDelete },
          ]}
        />
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-ink tnum">{formatCurrency(plan.price)}</span>
        <span className="pb-1 text-xs text-subtle">
          {plan.cycle === 'monthly' ? '/mês' : billingCycleLabels[plan.cycle].toLowerCase()}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={planStatusTone[plan.status]}>{planStatusLabels[plan.status]}</Badge>
        <Badge tone="neutral">{plan.weeklyFrequency}</Badge>
        <Badge tone="neutral">
          {plan.durationMonths > 0 ? `${plan.durationMonths} meses` : 'Sem fidelidade'}
        </Badge>
      </div>

      {plan.benefits.length > 0 ? (
        <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
          {plan.benefits.slice(0, 4).map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-xs text-muted">
              <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
              <span>{benefit}</span>
            </li>
          ))}
          {plan.benefits.length > 4 ? (
            <li className="text-xs text-subtle">+{plan.benefits.length - 4} benefícios</li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-subtle">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" />
          {students} {students === 1 ? 'aluno ativo' : 'alunos ativos'}
        </span>
        <button type="button" onClick={onEdit} className="font-medium text-accent-ink hover:underline">
          Editar
        </button>
      </div>
    </article>
  );
}
