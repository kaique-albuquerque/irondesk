import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserX } from 'lucide-react';
import { studentDetailService } from '@/services/api/student-detail.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Tabs } from '@/components/ui/Tabs';
import type { TabItem } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StudentProfileCard } from '@/components/students/detail/StudentProfileCard';
import { StudentOverviewPanel } from '@/components/students/detail/StudentOverviewPanel';
import { StudentEnrollmentsPanel, StudentPaymentsPanel } from '@/components/students/detail/StudentHistoryPanels';
import {
  StudentAssessmentsPanel,
  StudentCheckinsPanel,
  StudentWorkoutsPanel,
} from '@/components/students/detail/StudentActivityPanels';
import { StudentFormModal } from '@/components/students/StudentFormModal';

type TabValue = 'visao' | 'matriculas' | 'pagamentos' | 'treinos' | 'avaliacoes' | 'frequencia';

export function StudentDetailPage() {
  const { id = '' } = useParams();
  const { data, loading, error, reload } = useAsyncData(() => studentDetailService.get(id), [id]);
  const [tab, setTab] = useState<TabValue>('visao');
  const [formOpen, setFormOpen] = useState(false);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        icon={<UserX className="size-5" />}
        title="Aluno não encontrado"
        description="O cadastro pode ter sido removido ou o link está incorreto."
        action={
          <Link to="/alunos" className="text-xs font-medium text-accent-ink hover:underline">
            Voltar para alunos
          </Link>
        }
      />
    );
  }

  const tabs: TabItem<TabValue>[] = [
    { value: 'visao', label: 'Visão geral' },
    { value: 'matriculas', label: 'Matrículas', count: data.enrollments.length },
    { value: 'pagamentos', label: 'Pagamentos', count: data.payments.length },
    { value: 'treinos', label: 'Treinos', count: data.workouts.length },
    { value: 'avaliacoes', label: 'Avaliações', count: data.assessments.length },
    { value: 'frequencia', label: 'Frequência', count: data.checkins.length },
  ];

  return (
    <div className="space-y-5">
      <StudentProfileCard student={data.student} plan={data.plan} onEdit={() => setFormOpen(true)} />

      <Tabs items={tabs} value={tab} onChange={setTab} className="w-fit" />

      {tab === 'visao' ? <StudentOverviewPanel detail={data} /> : null}
      {tab === 'matriculas' ? <StudentEnrollmentsPanel enrollments={data.enrollments} /> : null}
      {tab === 'pagamentos' ? <StudentPaymentsPanel payments={data.payments} /> : null}
      {tab === 'treinos' ? <StudentWorkoutsPanel workouts={data.workouts} /> : null}
      {tab === 'avaliacoes' ? <StudentAssessmentsPanel assessments={data.assessments} /> : null}
      {tab === 'frequencia' ? <StudentCheckinsPanel checkins={data.checkins} /> : null}

      <StudentFormModal
        open={formOpen}
        student={data.student}
        plans={data.plans}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />
    </div>
  );
}
