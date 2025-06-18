import { Tool, Team } from './types';

export const TOOLS: Tool[] = [
  // Approved tools
  {
    id: 'gh-copilot',
    name: 'GitHub Copilot Business',
    price: 19,
    type: 'approved',
    category: 'Code Assistant'
  },
  {
    id: 'claude-code-pro',
    name: 'Claude Code Pro',
    price: 17,
    type: 'experimental',
    category: 'AI Assistant'
  },
  {
    id: 'claude-code-team',
    name: 'Claude Code Team',
    price: 25,
    type: 'experimental',
    category: 'AI Assistant'
  },
  {
    id: 'claude-code-enterprise',
    name: 'Claude Code Enterprise',
    price: 60,
    type: 'approved',
    category: 'AI Assistant'
  },
  {
    id: 'cursor-team',
    name: 'Cursor Teams',
    price: 40,
    type: 'approved',
    category: 'IDE'
  },
  // Experimental tools
  {
    id: 'gh-copilot-ft',
    name: 'GitHub Copilot with Fine-tuning',
    price: 60,
    type: 'experimental',
    category: 'Code Assistant'
  },
  {
    id: 'claude-code-max',
    name: 'Claude Code Max',
    price: 100,
    type: 'experimental',
    category: 'AI Assistant'
  },
  {
    id: 'windsurf-teams',
    name: 'Windsurf Teams + SSO',
    price: 40,
    type: 'experimental',
    category: 'IDE'
  }
];

export const TEAMS: Team[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    memberCount: 60,
    budgetAllocation: 3600
  },
  {
    id: 'ux',
    name: 'UX',
    memberCount: 9,
    budgetAllocation: 540
  },
  {
    id: 'pm',
    name: 'PM',
    memberCount: 5,
    budgetAllocation: 300
  },
  {
    id: 'external',
    name: 'External',
    memberCount: 10,
    budgetAllocation: 0 // External seats use leftover budget
  }
];

export const BUDGET_CONSTRAINTS = {
  monthlyBudget: 4500,
  premiumBuffer: 1250, // $15000/year
  totalMonthlyBudget: 5750,
  maxUserCost: 60,
  maxExperimentalTools: 3,
  maxUsersPerExperimentalTool: 5
}; 