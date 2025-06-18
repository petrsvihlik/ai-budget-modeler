import React, { useState, useEffect } from 'react';
import { BudgetScenario, BudgetSummary } from './types';
import { calculateBudgetSummary, getDefaultScenario } from './utils/budgetCalculator';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { BudgetDashboard } from './components/BudgetDashboard';
import { ToolsOverview } from './components/ToolsOverview';
import { Calculator, DollarSign } from 'lucide-react';

function App() {
  const [currentScenario, setCurrentScenario] = useState<BudgetScenario>(getDefaultScenario());
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'dashboard' | 'tools'>('builder');

  useEffect(() => {
    const summary = calculateBudgetSummary(currentScenario);
    setBudgetSummary(summary);
  }, [currentScenario]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Budget Modeler</h1>
                <p className="text-sm text-gray-600">Model AI tooling budget distribution across teams</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium">
                ${budgetSummary?.totalCost.toLocaleString()} / $5,750 monthly
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                budgetSummary?.withinBudget 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {budgetSummary?.budgetUtilization.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('builder')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'builder'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Scenario Builder
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Budget Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tools Overview
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'builder' && (
          <ScenarioBuilder
            scenario={currentScenario}
            onScenarioChange={setCurrentScenario}
            budgetSummary={budgetSummary}
          />
        )}
        
        {activeTab === 'dashboard' && budgetSummary && (
          <BudgetDashboard
            scenario={currentScenario}
            budgetSummary={budgetSummary}
          />
        )}
        
        {activeTab === 'tools' && (
          <ToolsOverview />
        )}
      </main>
    </div>
  );
}

export default App; 