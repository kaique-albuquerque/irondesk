export type PlanStatus = 'active' | 'inactive';

export type BillingCycle = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'trial' | 'custom';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  weeklyFrequency: string;
  cycle: BillingCycle;
  benefits: string[];
  status: PlanStatus;
  highlighted: boolean;
}

export type PlanInput = Omit<Plan, 'id'>;
