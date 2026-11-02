import type { Employee, EmployeeRole } from '@/interfaces/employee.interface';
import { addDays } from '@/utils/date';
import { randomChance } from '@/utils/random';
import { employeeNames } from './names.mock';

const roles: EmployeeRole[] = ['admin', 'manager', 'professor', 'professor', 'personal', 'receptionist', 'professor', 'personal', 'receptionist', 'manager'];

export function buildEmployees(today: string): Employee[] {
  return employeeNames.map((name, index) => {
    const role = roles[index];
    const [first, ...rest] = name.toLowerCase().split(' ');
    const email = `${first}.${rest.join('')}@irondesk.demo`;
    return {
      id: `emp_${`${index + 1}`.padStart(3, '0')}`,
      name,
      role,
      phone: `119${7000 + index}${1000 + index * 37}`,
      email,
      hiredAt: addDays(today, -(180 + index * 95)),
      status: randomChance(0.12) ? 'inactive' : 'active',
      notes: role === 'personal' ? 'Atendimento individual com agenda própria.' : '',
    };
  });
}
