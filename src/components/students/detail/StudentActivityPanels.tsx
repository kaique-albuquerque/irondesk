import type { StudentDetail } from '@/services/api/student-detail.service';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { AssessmentEvolutionChart } from '@/components/assessments/AssessmentEvolutionChart';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { formatNumber } from '@/utils/format';
import { formatDateBR, formatTimeBR } from '@/utils/date';
import { formatDuration } from '@/components/checkins/CheckinHistoryTable';

export function StudentWorkoutsPanel({ workouts }: { workouts: StudentDetail['workouts'] }) {
  return (
    <Card>
      <CardHeader title="Fichas de treino" description="Programas prescritos pelos professores" />
      <CardBody className="space-y-3">
        {workouts.length === 0 ? (
          <EmptyState title="Nenhuma ficha" description="Monte o primeiro treino deste aluno na área de treinos." />
        ) : (
          workouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)
        )}
      </CardBody>
    </Card>
  );
}

export function StudentAssessmentsPanel({ assessments }: { assessments: StudentDetail['assessments'] }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Evolução física" description="Peso e percentual de gordura por avaliação" />
        <CardBody>
          <AssessmentEvolutionChart assessments={assessments} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Avaliações registradas" description={`${formatNumber(assessments.length)} avaliações`} />
        <CardBody className="p-0">
          {assessments.length === 0 ? (
            <EmptyState title="Nenhuma avaliação" description="Registre medidas para acompanhar a evolução." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Data</TH>
                  <TH className="text-right">Peso</TH>
                  <TH className="text-right">IMC</TH>
                  <TH className="text-right">Gordura</TH>
                  <TH className="text-right">Cintura</TH>
                  <TH>Classificação</TH>
                </TR>
              </THead>
              <TBody>
                {assessments.map((assessment) => (
                  <TR key={assessment.id}>
                    <TD className="text-xs text-muted tnum">{formatDateBR(assessment.date)}</TD>
                    <TD className="text-right tnum">{assessment.weight} kg</TD>
                    <TD className="text-right tnum">{assessment.bmi.toFixed(1)}</TD>
                    <TD className="text-right tnum">{assessment.bodyFat}%</TD>
                    <TD className="text-right tnum">{assessment.measurements.waist} cm</TD>
                    <TD>
                      <Badge tone="neutral">{assessment.imcLabel}</Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export function StudentCheckinsPanel({ checkins }: { checkins: StudentDetail['checkins'] }) {
  return (
    <Card>
      <CardHeader title="Frequência" description={`${formatNumber(checkins.length)} check-ins registrados`} />
      <CardBody className="p-0">
        {checkins.length === 0 ? (
          <EmptyState title="Sem check-ins" description="O aluno ainda não registrou entradas na academia." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Data</TH>
                <TH>Entrada</TH>
                <TH>Saída</TH>
                <TH className="text-right">Duração</TH>
              </TR>
            </THead>
            <TBody>
              {checkins.map((checkin) => (
                <TR key={checkin.id}>
                  <TD className="text-sm text-ink tnum">{formatDateBR(checkin.date)}</TD>
                  <TD className="text-xs text-muted tnum">{formatTimeBR(checkin.checkInAt)}</TD>
                  <TD className="text-xs text-muted tnum">
                    {checkin.checkOutAt ? formatTimeBR(checkin.checkOutAt) : 'Em aberto'}
                  </TD>
                  <TD className="text-right tnum">{formatDuration(checkin.durationMinutes)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
