import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AssessmentView } from '@/interfaces/assessment.interface';
import { formatDateBR } from '@/utils/date';
import { ChartTooltip } from '@/components/charts/ChartTooltip';

export function AssessmentEvolutionChart({ assessments }: { assessments: AssessmentView[] }) {
  const data = assessments
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((assessment) => ({
      label: formatDateBR(assessment.date).slice(0, 5),
      peso: assessment.weight,
      gordura: assessment.bodyFat,
    }));

  if (data.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-line text-xs text-subtle">
        Registre ao menos duas avaliações para visualizar a evolução.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--app-fg-subtle)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--app-fg-subtle)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(value) => value.toLocaleString('pt-BR')} />} />
          <Line
            type="monotone"
            dataKey="peso"
            name="Peso (kg)"
            stroke="var(--app-accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--app-accent)' }}
          />
          <Line
            type="monotone"
            dataKey="gordura"
            name="Gordura (%)"
            stroke="var(--app-info)"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={{ r: 3, fill: 'var(--app-info)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
