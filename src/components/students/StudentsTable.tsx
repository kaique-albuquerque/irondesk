import { Link, useNavigate } from 'react-router-dom';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Plan } from '@/interfaces/plan.interface';
import type { Student } from '@/interfaces/student.interface';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { studentStatusLabels } from '@/constants/labels';
import { studentStatusTone } from '@/constants/status';
import { formatPhone } from '@/utils/format';

interface StudentsTableProps {
  students: Student[];
  plansById: Record<string, Plan>;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentsTable({ students, plansById, onEdit, onDelete }: StudentsTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <THead>
        <TR>
          <TH>Aluno</TH>
          <TH>Plano</TH>
          <TH>Contato</TH>
          <TH>Status</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {students.map((student) => {
          const plan = student.planId ? plansById[student.planId] : null;
          return (
            <TR key={student.id}>
              <TD>
                <Link to={`/alunos/${student.id}`} className="flex items-center gap-3 group">
                  <Avatar name={student.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink group-hover:text-accent-ink">
                      {student.name}
                    </span>
                    <span className="block truncate text-xs text-subtle">{student.email}</span>
                  </span>
                </Link>
              </TD>
              <TD>
                {plan ? (
                  <span className="text-sm text-ink">{plan.name}</span>
                ) : (
                  <span className="text-sm text-subtle">Sem plano</span>
                )}
              </TD>
              <TD>
                <span className="text-sm text-muted tnum">{formatPhone(student.phone)}</span>
              </TD>
              <TD>
                <Badge tone={studentStatusTone[student.status]}>
                  {studentStatusLabels[student.status]}
                </Badge>
              </TD>
              <TD>
                <div className="flex justify-end">
                  <Dropdown
                    trigger={
                      <span className="inline-flex size-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-2 hover:text-ink">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Ações de {student.name}</span>
                      </span>
                    }
                    items={[
                      {
                        label: 'Ver perfil',
                        icon: <Eye className="size-3.5" />,
                        onClick: () => navigate(`/alunos/${student.id}`),
                      },
                      {
                        label: 'Editar',
                        icon: <Pencil className="size-3.5" />,
                        onClick: () => onEdit(student),
                      },
                      {
                        label: 'Excluir',
                        icon: <Trash2 className="size-3.5" />,
                        danger: true,
                        onClick: () => onDelete(student),
                      },
                    ]}
                  />
                </div>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}
