import { Activity, Ruler, Scale, Target } from 'lucide-react';
import type { AssessmentView } from '@/interfaces/assessment.interface';
import { StatCard } from '@/components/ui/StatCard';
import { formatDateBR } from '@/utils/date';

interface AssessmentSummaryCardsProps {
  latest: AssessmentView;
  previous: AssessmentView | null;
  assessorName: string;
}

function variation(current: number, before: number | undefined): number {
  if (before === undefined || before === 0) return 0;
  return Number((((current - before) / before) * 100).toFixed(1));
}

export function AssessmentSummaryCards({ latest, previous, assessorName }: AssessmentSummaryCardsProps) {
  const weightDelta = previous ? Number((latest.weight - previous.weight).toFixed(1)) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Peso atual"
        value={`${latest.weight.toFixed(1)} kg`}
        hint={previous ? `${weightDelta > 0 ? '+' : ''}${weightDelta} kg vs. anterior` : 'Primeira avaliação'}
        icon={<Scale className="size-4" />}
        trend={previous ? { value: variation(latest.weight, previous.weight) } : undefined}
      />
      <StatCard
        label="IMC"
        value={`${latest.bmi}`}
        hint={latest.imcLabel}
        icon={<Ruler className="size-4" />}
        tone={latest.bmi >= 18.5 && latest.bmi < 25 ? 'success' : 'warning'}
      />
      <StatCard
        label="Gordura corporal"
        value={`${latest.bodyFat.toFixed(1)}%`}
        hint={previous ? `Antes: ${previous.bodyFat.toFixed(1)}%` : 'Sem comparativo'}
        icon={<Activity className="size-4" />}
        tone="info"
        trend={previous ? { value: variation(latest.bodyFat, previous.bodyFat) } : undefined}
      />
      <StatCard
        label="Última avaliação"
        value={formatDateBR(latest.date)}
        hint={`Avaliador: ${assessorName}`}
        icon={<Target className="size-4" />}
        tone="neutral"
      />
    </div>
  );
}
