import { Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '@/interfaces/employee.interface';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { employeeRoleLabels, employeeStatusLabels } from '@/constants/labels';
import { employeeStatusTone } from '@/constants/status';
import { formatDateBR } from '@/utils/date';
import { formatPhone } from '@/utils/format';

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeesTable({ employees, onEdit, onDelete }: EmployeesTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Colaborador</TH>
          <TH>Função</TH>
          <TH>Contato</TH>
          <TH>Contratação</TH>
          <TH>Status</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {employees.map((employee) => (
          <TR key={employee.id}>
            <TD>
              <div className="flex items-center gap-3">
                <Avatar name={employee.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink">{employee.name}</p>
                  <p className="text-[11px] text-subtle">{employee.email}</p>
                </div>
              </div>
            </TD>
            <TD>
              <Badge tone="neutral">{employeeRoleLabels[employee.role]}</Badge>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">{formatPhone(employee.phone)}</span>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">{formatDateBR(employee.hiredAt)}</span>
            </TD>
            <TD>
              <Badge tone={employeeStatusTone[employee.status]}>{employeeStatusLabels[employee.status]}</Badge>
            </TD>
            <TD>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label="Editar colaborador" onClick={() => onEdit(employee)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Excluir colaborador" onClick={() => onDelete(employee)}>
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
