import React from 'react';
import { BudgetScenario, BudgetSummary } from '../types';
import { TOOLS, TEAMS, BUDGET_CONSTRAINTS } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface BudgetDashboardProps {
  scenario: BudgetScenario;
  budgetSummary: BudgetSummary;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function BudgetDashboard({ scenario, budgetSummary }: BudgetDashboardProps) {
  const teamChartData = TEAMS.map(team => ({
    name: team.name,
    cost: budgetSummary.teamCosts[team.id] || 0,
    budget: team.budgetAllocation,
    utilization: team.budgetAllocation > 0 ? ((budgetSummary.teamCosts[team.id] || 0) / team.budgetAllocation) * 100 : 0
  }));

  const toolChartData = Object.entries(budgetSummary.toolCosts).map(([toolId, cost]) => {
    const tool = TOOLS.find(t => t.id === toolId);
    return {
      name: tool?.name || toolId,
      cost,
      type: tool?.type || 'unknown'
    };
  });

  const totalUsers = scenario.assignments.reduce((sum, assignment) => sum + assignment.userCount, 0);
  const avgCostPerUser = totalUsers > 0 ? budgetSummary.totalCost / totalUsers : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${budgetSummary.totalCost.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {budgetSummary.budgetUtilization.toFixed(1)}% of budget used
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Across {scenario.assignments.length} assignments
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Cost/User</p>
              <p className="text-2xl font-bold text-gray-900">
                ${avgCostPerUser.toFixed(0)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Max: ${BUDGET_CONSTRAINTS.maxUserCost}/user
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Experimental</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgetSummary.experimentalToolsUsed}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {budgetSummary.experimentalUsersCount} users
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Budget Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === 'cost' ? 'Cost' : 'Budget'
                ]}
              />
              <Bar dataKey="cost" fill="#3B82F6" name="cost" />
              <Bar dataKey="budget" fill="#E5E7EB" name="budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamChartData.filter(team => team.cost > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cost"
              >
                {teamChartData.filter(team => team.cost > 0).map((entry, index) => (
                  <Cell key={`team-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Team Cost']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Distribution by Tool</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={toolChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cost"
              >
                {toolChartData.map((entry, index) => (
                  <Cell key={`tool-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Tool Cost']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Assignment Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scenario.assignments.map((assignment, index) => {
                const tool = TOOLS.find(t => t.id === assignment.toolId);
                const team = TEAMS.find(t => t.id === assignment.teamId);
                const cost = tool ? tool.price * assignment.userCount : 0;
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tool?.name || 'Unknown Tool'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team?.name || 'Unknown Team'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.userCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${tool?.price || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tool?.type === 'experimental' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {tool?.type || 'unknown'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 