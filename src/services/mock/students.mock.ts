import type { Plan } from '@/interfaces/plan.interface';
import type { Student } from '@/interfaces/student.interface';
import { addDays } from '@/utils/date';
import { random, randomChance, randomInt, randomPick } from '@/utils/random';
import { planWeight } from './plans.mock';
import { cities, firstNames, lastNames, streets } from './names.mock';

function pickPlanId(plans: Plan[]): string {
  const total = plans.reduce((sum, plan) => sum + (planWeight[plan.id] ?? 0), 0);
  let ticket = random() * total;
  for (const plan of plans) {
    ticket -= planWeight[plan.id] ?? 0;
    if (ticket <= 0) return plan.id;
  }
  return plans[0].id;
}

function fakeCpf(): string {
  const digits = Array.from({ length: 9 }, () => randomInt(0, 9)).join('');
  return `${digits}${randomInt(0, 9)}${randomInt(0, 9)}`;
}

export function buildStudents(plans: Plan[], today: string): Student[] {
  return Array.from({ length: 44 }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 7 + 3) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const location = randomPick(cities);
    const createdAt = addDays(today, -randomInt(20, 540));
    const planId = pickPlanId(plans);
    return {
      id: `std_${`${index + 1}`.padStart(3, '0')}`,
      name,
      cpf: fakeCpf(),
      birthDate: addDays(today, -randomInt(18, 52) * 365 - randomInt(0, 364)),
      phone: `119${randomInt(1000, 9999)}${randomInt(1000, 9999)}`,
      email: `${firstName}.${lastName}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@exemplo.com',
      address: {
        street: `${randomPick(streets)}, ${randomInt(20, 1800)}`,
        city: location.city,
        state: location.state,
        zipCode: `0${randomInt(1000, 9999)}-${randomInt(100, 999)}`,
      },
      createdAt,
      planId,
      status: randomChance(0.09) ? 'inactive' : 'active',
      notes: randomChance(0.25) ? randomPick(['Prefere treinar pela manhã.', 'Indicação de aluno antigo.', 'Objetivo: condicionamento geral.', 'Acompanhamento com personal.']) : '',
    };
  });
}
