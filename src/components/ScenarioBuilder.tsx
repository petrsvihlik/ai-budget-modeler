import React, { useState } from 'react';
import { BudgetScenario, BudgetSummary, ToolAssignment } from '../types';
import { TOOLS, TEAMS } from '../data';
import { getPresetScenarios } from '../utils/budgetCalculator';
import { Plus, Trash2, AlertTriangle, BarChart3, Zap, Shield, Target, Beaker } from 'lucide-react';
import { MultiHandleSlider } from './MultiHandleSlider';

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
  const [showMultiSlider, setShowMultiSlider] = useState(false);
  
  const presetScenarios = getPresetScenarios();
  
  const loadPresetScenario = (presetScenario: BudgetScenario) => {
    onScenarioChange(presetScenario);
  };
  
  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case 'conservative': return Shield;
      case 'balanced': return Target;
      case 'ambitious': return Zap;
      case 'experimental': return Beaker;
      default: return Target;
    }
  };
  
  const getScenarioColor = (scenarioId: string) => {
    switch (scenarioId) {
      case 'conservative': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300';
      case 'balanced': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300';
      case 'ambitious': return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300';
      case 'experimental': return 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
    }
  };

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
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose a Preset Scenario
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetScenarios.map((preset) => {
              const Icon = getScenarioIcon(preset.id);
              const isActive = scenario.id === preset.id;
              return (
                                  <button
                    key={preset.id}
                    onClick={() => loadPresetScenario(preset)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? getScenarioColor(preset.id).replace('hover:', '') + ' ring-2 ring-offset-2 ring-blue-500'
                        : getScenarioColor(preset.id)
                    }`}
                    title={preset.description}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{preset.name}</span>
                    <span className="text-xs opacity-75 mt-1 text-center">
                      {preset.assignments.length} assignments
                    </span>
                  </button>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <div>
              <strong>Current:</strong> {scenario.name} 
              <span className="ml-2 text-gray-500">
                ({scenario.assignments.length} assignments)
              </span>
            </div>
            {scenario.description && (
              <div className="text-gray-500 mt-1">
                {scenario.description}
              </div>
            )}
          </div>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tool Assignments</h3>
          <button
            onClick={() => setShowMultiSlider(!showMultiSlider)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showMultiSlider 
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>{showMultiSlider ? 'Hide Multi-Slider' : 'Multi-Handle Slider'}</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {scenario.assignments.map((assignment, index) => {
            const tool = TOOLS.find(t => t.id === assignment.toolId);
            const team = TEAMS.find(t => t.id === assignment.teamId);
            const cost = tool ? tool.price * assignment.userCount : 0;
            
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <select
                      value={assignment.teamId}
                      onChange={(e) => updateAssignment(index, 'teamId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Team</option>
                      {TEAMS.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
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
                
                {/* Integrated Slider */}
                {tool && team && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Users: {assignment.userCount}</span>
                      <span className="text-gray-500">Max: {team.memberCount}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={team.memberCount}
                      value={assignment.userCount}
                      onChange={(e) => updateAssignment(index, 'userCount', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((assignment.userCount - 1) / (team.memberCount - 1)) * 100}%, #E5E7EB ${((assignment.userCount - 1) / (team.memberCount - 1)) * 100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1</span>
                      <span>{team.memberCount}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <select
                value={newAssignment.teamId || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, teamId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Team</option>
                {TEAMS.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            
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

        {/* Multi-Handle Slider Interface */}
        {showMultiSlider && scenario.assignments.length > 0 && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h4 className="text-lg font-semibold text-purple-900">Multi-Handle Distribution Slider</h4>
            </div>
            <MultiHandleSlider
              assignments={scenario.assignments}
              onAssignmentsChange={(newAssignments) => 
                onScenarioChange({ ...scenario, assignments: newAssignments })
              }
              totalBudget={budgetSummary?.totalCost || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
} 