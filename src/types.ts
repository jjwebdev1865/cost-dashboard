export type Expense = {
  category: string;
  description: string;
  amount: number;
  color: string;
};

export type ProjectPhase = {
  name: string;
  hours: number;
  color: string;
};

export type CostForecast = {
  month: string;
  amount: number;
};

export type CustomerCostProfile = {
  customerName: string;
  monthlyBudget: number;
  budgetNote: string;
  monthlyExpenses: Expense[];
  projectHours: ProjectPhase[];
  costForecast: CostForecast[];
};

export type MockUser = CustomerCostProfile & {
  email: string;
  password: string;
  name: string;
  company: string;
};

export type TeamMember = {
  name: string;
  role: string;
  email: string;
  bio: string;
};
