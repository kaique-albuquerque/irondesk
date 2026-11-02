import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CountSeriesPoint } from '@/interfaces/dashboard.interface';
import { formatNumber } from '@/utils/format';
import { ChartTooltip } from './ChartTooltip';

export function StudentsChart({ data }: { data: CountSeriesPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--app-success)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--app-success)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--app-fg-subtle)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--app-fg-subtle)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip formatter={formatNumber} />} />
          <Area
            type="monotone"
            dataKey="alunos"
            name="Alunos"
            stroke="var(--app-success)"
            strokeWidth={2}
            fill="url(#studentsFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
