export interface Tool {
  id: string;
  name: string;
  price: number;
  type: 'approved' | 'experimental';
  category?: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  budgetAllocation: number; // monthly budget for this team
}

export interface ToolAssignment {
  toolId: string;
  teamId: string;
  userCount: number;
}

export interface BudgetScenario {
  id: string;
  name: string;
  assignments: ToolAssignment[];
  externalSeats: number;
}

export interface BudgetSummary {
  totalCost: number;
  teamCosts: Record<string, number>;
  toolCosts: Record<string, number>;
  budgetUtilization: number;
  experimentalToolsUsed: number;
  experimentalUsersCount: number;
  withinBudget: boolean;
  warnings: string[];
} 