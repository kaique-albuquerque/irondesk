import { Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '@/interfaces/payment.interface';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { expenseCategoryLabels } from '@/constants/labels';
import { formatDateBR } from '@/utils/date';
import { formatCurrency } from '@/utils/format';

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Descrição</TH>
          <TH>Categoria</TH>
          <TH>Data</TH>
          <TH>Valor</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {expenses.map((expense) => (
          <TR key={expense.id}>
            <TD>
              <span className="text-sm font-medium text-ink">{expense.description}</span>
              {expense.notes ? <p className="text-[11px] text-subtle">{expense.notes}</p> : null}
            </TD>
            <TD>
              <Badge tone="neutral">{expenseCategoryLabels[expense.category]}</Badge>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">{formatDateBR(expense.date)}</span>
            </TD>
            <TD>
              <span className="text-sm font-medium text-danger tnum">- {formatCurrency(expense.amount)}</span>
            </TD>
            <TD>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label="Editar despesa" onClick={() => onEdit(expense)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Excluir despesa" onClick={() => onDelete(expense)}>
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
