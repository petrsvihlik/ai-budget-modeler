import React, { useState } from 'react';
import { BudgetScenario, BudgetSummary, ToolAssignment } from '../types';
import { TOOLS, TEAMS } from '../data';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface ScenarioBuilderProps {
  scenario: BudgetScenario;
  onScenarioChange: (scenario: BudgetScenario) => void;
  budgetSummary: BudgetSummary | null;
}

export function ScenarioBuilder({ scenario, onScenarioChange, budgetSummary }: ScenarioBuilderProps) {
  const [newAssignment, setNewAssignment] = useState<Partial<ToolAssignment>>({
    toolId: '',
    teamId: '',
    userCount: 1
  });

  const addAssignment = () => {
    if (newAssignment.toolId && newAssignment.teamId && newAssignment.userCount) {
      const assignment: ToolAssignment = {
        toolId: newAssignment.toolId,
        teamId: newAssignment.teamId,
        userCount: newAssignment.userCount
      };
      
      onScenarioChange({
        ...scenario,
        assignments: [...scenario.assignments, assignment]
      });
      
      setNewAssignment({ toolId: '', teamId: '', userCount: 1 });
    }
  };

  const removeAssignment = (index: number) => {
    const newAssignments = scenario.assignments.filter((_, i) => i !== index);
    onScenarioChange({
      ...scenario,
      assignments: newAssignments
    });
  };

  const updateAssignment = (index: number, field: keyof ToolAssignment, value: string | number) => {
    const newAssignments = [...scenario.assignments];
    newAssignments[index] = {
      ...newAssignments[index],
      [field]: value
    };
    onScenarioChange({
      ...scenario,
      assignments: newAssignments
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Scenario Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario Name
          </label>
          <input
            type="text"
            value={scenario.name}
            onChange={(e) => onScenarioChange({ ...scenario, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {budgetSummary && budgetSummary.warnings.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-medium text-red-800">Warnings</h3>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {budgetSummary.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Assignments</h3>
        
        <div className="space-y-4">
          {scenario.assignments.map((assignment, index) => {
            const tool = TOOLS.find(t => t.id === assignment.toolId);
            const team = TEAMS.find(t => t.id === assignment.teamId);
            const cost = tool ? tool.price * assignment.userCount : 0;
            
            return (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <select
                    value={assignment.toolId}
                    onChange={(e) => updateAssignment(index, 'toolId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Tool</option>
                    {TOOLS.map(tool => (
                      <option key={tool.id} value={tool.id}>
                        {tool.name} (${tool.price}/user) - {tool.type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <select
                    value={assignment.teamId}
                    onChange={(e) => updateAssignment(index, 'teamId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Team</option>
                    {TEAMS.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.memberCount} members)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    max={team?.memberCount || 100}
                    value={assignment.userCount}
                    onChange={(e) => updateAssignment(index, 'userCount', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="w-24 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${cost.toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={() => removeAssignment(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <select
                value={newAssignment.toolId || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, toolId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Tool</option>
                {TOOLS.map(tool => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name} (${tool.price}/user) - {tool.type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <select
                value={newAssignment.teamId || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, teamId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Team</option>
                {TEAMS.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.memberCount} members)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-24">
              <input
                type="number"
                min="1"
                value={newAssignment.userCount || 1}
                onChange={(e) => setNewAssignment({ ...newAssignment, userCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={addAssignment}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 