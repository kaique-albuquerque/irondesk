import { Pencil, Trash2 } from 'lucide-react';
import type { AssessmentView } from '@/interfaces/assessment.interface';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { formatDateBR } from '@/utils/date';

interface AssessmentsTableProps {
  assessments: AssessmentView[];
  onEdit: (assessment: AssessmentView) => void;
  onDelete: (assessment: AssessmentView) => void;
}

export function AssessmentsTable({ assessments, onEdit, onDelete }: AssessmentsTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Data</TH>
          <TH>Peso</TH>
          <TH>Altura</TH>
          <TH>IMC</TH>
          <TH>Gordura</TH>
          <TH>Cintura</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {assessments.map((assessment) => (
          <TR key={assessment.id}>
            <TD>
              <span className="text-sm font-medium text-ink tnum">{formatDateBR(assessment.date)}</span>
            </TD>
            <TD>
              <span className="text-sm text-ink tnum">{assessment.weight.toFixed(1)} kg</span>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">{assessment.height.toFixed(0)} cm</span>
            </TD>
            <TD>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink tnum">{assessment.bmi}</span>
                <Badge tone={assessment.bmi >= 18.5 && assessment.bmi < 25 ? 'success' : 'warning'}>
                  {assessment.imcLabel}
                </Badge>
              </div>
            </TD>
            <TD>
              <span className="text-sm text-muted tnum">{assessment.bodyFat.toFixed(1)}%</span>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">{assessment.measurements.waist.toFixed(1)} cm</span>
            </TD>
            <TD>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label="Editar avaliação" onClick={() => onEdit(assessment)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Excluir avaliação" onClick={() => onDelete(assessment)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
