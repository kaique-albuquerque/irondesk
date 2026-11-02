import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { DistributionSlice } from '@/interfaces/dashboard.interface';
import { formatNumber } from '@/utils/format';
import { ChartTooltip } from './ChartTooltip';

interface DistributionChartProps {
  data: DistributionSlice[];
  height?: number;
  formatter?: (value: number) => string;
}

export function DistributionChart({ data, height = 200, formatter = formatNumber }: DistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-subtle">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip formatter={formatter} />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionLegend({ data, formatter = formatNumber }: Omit<DistributionChartProps, 'height'>) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <ul className="space-y-2">
      {data.map((slice) => (
        <li key={slice.name} className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full" style={{ backgroundColor: slice.color }} />
          <span className="min-w-0 flex-1 truncate text-muted">{slice.name}</span>
          <span className="font-medium text-ink tnum">{formatter(slice.value)}</span>
          <span className="w-10 text-right text-subtle tnum">
            {total === 0 ? '0%' : `${Math.round((slice.value / total) * 100)}%`}
          </span>
        </li>
      ))}
    </ul>
  );
}
