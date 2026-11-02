export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export type StudentStatus = 'active' | 'inactive';

export interface Student {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  address: Address;
  createdAt: string;
  planId: string | null;
  status: StudentStatus;
  notes: string;
}

export type StudentInput = Omit<Student, 'id' | 'createdAt'>;
