import type { Expense, ExpenseCategory } from '@/interfaces/payment.interface';
import { lastMonthKeys, parseISODate } from '@/utils/date';
import { randomChance, randomInt } from '@/utils/random';

interface ExpenseTemplate {
  category: ExpenseCategory;
  description: string;
  min: number;
  max: number;
  everyMonth: boolean;
}

const templates: ExpenseTemplate[] = [
  { category: 'rent', description: 'Aluguel do imóvel', min: 6800, max: 6800, everyMonth: true },
  { category: 'payroll', description: 'Folha de pagamento da equipe', min: 18500, max: 23500, everyMonth: true },
  { category: 'utilities', description: 'Água, luz e internet', min: 1250, max: 2100, everyMonth: true },
  { category: 'marketing', description: 'Mídia paga e materiais', min: 900, max: 2400, everyMonth: true },
  { category: 'maintenance', description: 'Manutenção de equipamentos', min: 350, max: 1600, everyMonth: false },
  { category: 'equipment', description: 'Reposição de acessórios', min: 800, max: 3200, everyMonth: false },
  { category: 'other', description: 'Despesas administrativas', min: 240, max: 980, everyMonth: true },
];

export function buildExpenses(today: string): Expense[] {
  const months = lastMonthKeys(7, parseISODate(today));
  const expenses: Expense[] = [];
  months.forEach((month) => {
    templates.forEach((template, templateIndex) => {
      if (!template.everyMonth && !randomChance(0.55)) return;
      const amount = randomInt(template.min, template.max);
      expenses.push({
        id: `exp_${month}_${templateIndex}`,
        description: template.description,
        category: template.category,
        amount,
        date: `${month}-${`${randomInt(3, 26)}`.padStart(2, '0')}`,
        notes: '',
      });
    });
  });
  return expenses;
}
