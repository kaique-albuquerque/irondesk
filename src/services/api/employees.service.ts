import type { Employee, EmployeeInput } from '@/interfaces/employee.interface';
import { simulateLatency, sortBy } from '@/services/api/helpers';
import { mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';

export const employeesService = {
  async list(): Promise<Employee[]> {
    await simulateLatency();
    return sortBy(selectCollection('employees'), (employee) => employee.name);
  },

  async create(input: EmployeeInput): Promise<Employee> {
    await simulateLatency();
    const duplicated = selectCollection('employees').some(
      (employee) => employee.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (duplicated) throw new AppError('Já existe um colaborador com este e-mail.');
    const employee: Employee = { ...input, id: createId('emp') };
    mutateDatabase((database) => {
      database.employees.push(employee);
    });
    return employee;
  },

  async update(id: string, input: EmployeeInput): Promise<Employee> {
    await simulateLatency();
    return mutateDatabase((database) => {
      const index = database.employees.findIndex((employee) => employee.id === id);
      if (index < 0) throw new AppError('Colaborador não encontrado.');
      database.employees[index] = { ...database.employees[index], ...input };
      return database.employees[index];
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.employees = database.employees.filter((employee) => employee.id !== id);
      database.workouts.forEach((workout) => {
        if (workout.trainerId === id) workout.trainerId = '';
      });
    });
  },
};
