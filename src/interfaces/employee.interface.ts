export type EmployeeRole =
  | 'professor'
  | 'personal'
  | 'receptionist'
  | 'manager'
  | 'admin';

export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  phone: string;
  email: string;
  hiredAt: string;
  status: EmployeeStatus;
  notes: string;
}

export type EmployeeInput = Omit<Employee, 'id'>;
