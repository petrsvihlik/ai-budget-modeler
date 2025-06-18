import { BudgetScenario, BudgetSummary, Tool, Team, ToolAssignment } from '../types';
import { BUDGET_CONSTRAINTS, TOOLS, TEAMS } from '../data';

export function calculateBudgetSummary(scenario: BudgetScenario): BudgetSummary {
  const teamCosts: Record<string, number> = {};
  const toolCosts: Record<string, number> = {};
  const warnings: string[] = [];
  
  let totalCost = 0;
  let experimentalToolsUsed = 0;
  let experimentalUsersCount = 0;
  
  const experimentalTools = new Set<string>();
  
  // Initialize team costs
  TEAMS.forEach(team => {
    teamCosts[team.id] = 0;
  });
  
  // Calculate costs for each assignment
  scenario.assignments.forEach(assignment => {
    const tool = TOOLS.find(t => t.id === assignment.toolId);
    const team = TEAMS.find(t => t.id === assignment.teamId);
    
    if (!tool || !team) return;
    
    const assignmentCost = tool.price * assignment.userCount;
    totalCost += assignmentCost;
    
    teamCosts[team.id] += assignmentCost;
    toolCosts[tool.id] = (toolCosts[tool.id] || 0) + assignmentCost;
    
    // Track experimental tools
    if (tool.type === 'experimental') {
      experimentalTools.add(tool.id);
      experimentalUsersCount += assignment.userCount;
      
      // Check experimental tool user limit
      if (assignment.userCount > BUDGET_CONSTRAINTS.maxUsersPerExperimentalTool) {
        warnings.push(
          `${tool.name} exceeds max ${BUDGET_CONSTRAINTS.maxUsersPerExperimentalTool} users per experimental tool (${assignment.userCount} assigned)`
        );
      }
    }
    
    // Check user cost limit
    if (tool.price > BUDGET_CONSTRAINTS.maxUserCost) {
      warnings.push(
        `${tool.name} ($${tool.price}) exceeds max user cost of $${BUDGET_CONSTRAINTS.maxUserCost}`
      );
    }
    
    // Check if team assignment exceeds team member count
    if (assignment.userCount > team.memberCount) {
      warnings.push(
        `${team.name} assignment (${assignment.userCount}) exceeds team size (${team.memberCount})`
      );
    }
  });
  
  experimentalToolsUsed = experimentalTools.size;
  
  // Check experimental tools limit
  if (experimentalToolsUsed > BUDGET_CONSTRAINTS.maxExperimentalTools) {
    warnings.push(
      `Using ${experimentalToolsUsed} experimental tools, max allowed is ${BUDGET_CONSTRAINTS.maxExperimentalTools}`
    );
  }
  
  // Check individual team budgets
  TEAMS.forEach(team => {
    if (team.budgetAllocation > 0 && teamCosts[team.id] > team.budgetAllocation) {
      warnings.push(
        `${team.name} cost ($${teamCosts[team.id]}) exceeds allocated budget ($${team.budgetAllocation})`
      );
    }
  });
  
  const budgetUtilization = (totalCost / BUDGET_CONSTRAINTS.totalMonthlyBudget) * 100;
  const withinBudget = totalCost <= BUDGET_CONSTRAINTS.totalMonthlyBudget;
  
  if (!withinBudget) {
    warnings.push(
      `Total cost ($${totalCost}) exceeds monthly budget ($${BUDGET_CONSTRAINTS.totalMonthlyBudget})`
    );
  }
  
  return {
    totalCost,
    teamCosts,
    toolCosts,
    budgetUtilization,
    experimentalToolsUsed,
    experimentalUsersCount,
    withinBudget,
    warnings
  };
}

export function getDefaultScenario(): BudgetScenario {
  return {
    id: 'default',
    name: 'Default Scenario',
    assignments: [
      { toolId: 'gh-copilot', teamId: 'engineering', userCount: 40 },
      { toolId: 'cursor-team', teamId: 'engineering', userCount: 20 },
      { toolId: 'claude-code', teamId: 'ux', userCount: 9 },
      { toolId: 'claude-code', teamId: 'pm', userCount: 5 },
    ],
    externalSeats: 10
  };
}

export function validateAssignment(assignment: ToolAssignment): string[] {
  const errors: string[] = [];
  const tool = TOOLS.find(t => t.id === assignment.toolId);
  const team = TEAMS.find(t => t.id === assignment.teamId);
  
  if (!tool) {
    errors.push('Invalid tool selected');
    return errors;
  }
  
  if (!team) {
    errors.push('Invalid team selected');
    return errors;
  }
  
  if (assignment.userCount <= 0) {
    errors.push('User count must be greater than 0');
  }
  
  if (assignment.userCount > team.memberCount) {
    errors.push(`Cannot assign more users (${assignment.userCount}) than team size (${team.memberCount})`);
  }
  
  return errors;
} 