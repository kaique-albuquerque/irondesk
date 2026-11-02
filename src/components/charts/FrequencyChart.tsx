import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DayFrequencyPoint } from '@/interfaces/dashboard.interface';
import { formatNumber } from '@/utils/format';
import { ChartTooltip } from './ChartTooltip';

export function FrequencyChart({ data }: { data: DayFrequencyPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" vertical={false} />
          <XAxis
            dataKey="day"
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
          <Tooltip
            cursor={{ fill: 'var(--app-surface-3)' }}
            content={<ChartTooltip formatter={formatNumber} />}
          />
          <Bar dataKey="checkins" name="Check-ins" radius={[6, 6, 0, 0]} maxBarSize={38}>
            {data.map((entry, index) => (
              <Cell
                key={entry.day}
                fill={index === data.length - 1 ? 'var(--app-accent)' : 'var(--app-border-strong)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
