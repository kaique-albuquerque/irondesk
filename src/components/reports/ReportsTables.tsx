import type { PlanPerformance, StudentRanking } from '@/interfaces/reports.interface';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatNumber } from '@/utils/format';

export function ReportsPlanTable({ plans }: { plans: PlanPerformance[] }) {
  return (
    <Card>
      <CardHeader title="Desempenho por plano" description="Alunos ativos e receita recorrente contratada" />
      <CardBody className="p-0">
        {plans.length === 0 ? (
          <EmptyState title="Sem planos ativos" description="Cadastre planos para acompanhar o desempenho." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Plano</TH>
                <TH className="text-right">Alunos ativos</TH>
                <TH className="text-right">Receita mensal</TH>
              </TR>
            </THead>
            <TBody>
              {plans.map((plan) => (
                <TR key={plan.name}>
                  <TD className="font-medium text-ink">{plan.name}</TD>
                  <TD className="text-right tnum">{formatNumber(plan.students)}</TD>
                  <TD className="text-right font-medium text-ink tnum">{formatCurrency(plan.revenue)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

export function ReportsTopStudents({ students }: { students: StudentRanking[] }) {
  return (
    <Card>
      <CardHeader title="Alunos mais frequentes" description="Check-ins acumulados desde o início da base" />
      <CardBody className="space-y-3">
        {students.length === 0 ? (
          <p className="text-xs text-subtle">Nenhum check-in registrado.</p>
        ) : (
          students.map((student, index) => (
            <div key={student.id} className="flex items-center gap-3">
              <span className="w-5 text-xs font-semibold text-subtle tnum">{index + 1}</span>
              <Avatar name={student.name} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{student.name}</span>
              <span className="text-xs font-medium text-muted tnum">{formatNumber(student.checkins)} check-ins</span>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}
