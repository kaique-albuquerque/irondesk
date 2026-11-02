import type { AssessmentView } from '@/interfaces/assessment.interface';
import { AssessmentEvolutionChart } from '@/components/assessments/AssessmentEvolutionChart';
import { AssessmentSummaryCards } from '@/components/assessments/AssessmentSummaryCards';
import { AssessmentsTable } from '@/components/assessments/AssessmentsTable';

interface AssessmentsStudentSectionProps {
  assessments: AssessmentView[];
  assessorName: string;
  onEdit: (assessment: AssessmentView) => void;
  onDelete: (assessment: AssessmentView) => void;
}

export function AssessmentsStudentSection({
  assessments,
  assessorName,
  onEdit,
  onDelete,
}: AssessmentsStudentSectionProps) {
  return (
    <>
      <AssessmentSummaryCards
        latest={assessments[0]}
        previous={assessments[1] ?? null}
        assessorName={assessorName}
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold text-ink">Evolução</h2>
          <p className="mb-3 mt-0.5 text-xs text-muted">Peso corporal e percentual de gordura por avaliação.</p>
          <AssessmentEvolutionChart assessments={assessments} />
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Histórico do aluno</h2>
            <p className="text-xs text-muted">{assessments[0].studentName}</p>
          </div>
          <div className="max-h-[360px] overflow-auto">
            <AssessmentsTable assessments={assessments} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </div>
    </>
  );
}
