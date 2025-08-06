import { useState, useEffect } from 'react';
import { BudgetScenario, BudgetSummary } from './types';
import { calculateBudgetSummary, getDefaultScenario } from './utils/budgetCalculator';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { BudgetDashboard } from './components/BudgetDashboard';
import { ToolsOverview } from './components/ToolsOverview';
import { BUDGET_CONSTRAINTS } from './data';
import { Calculator, DollarSign } from 'lucide-react';

function App() {
  const [currentScenario, setCurrentScenario] = useState<BudgetScenario>(getDefaultScenario());
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'dashboard' | 'tools'>('builder');

  useEffect(() => {
    const summary = calculateBudgetSummary(currentScenario);
    setBudgetSummary(summary);
  }, [currentScenario]);

  // Calculate base budget vs buffer usage for header
  const baseBudgetUtilization = budgetSummary ? (budgetSummary.totalCost / BUDGET_CONSTRAINTS.monthlyBudget) * 100 : 0;
  const isUsingBuffer = budgetSummary ? budgetSummary.totalCost > BUDGET_CONSTRAINTS.monthlyBudget : false;
  const bufferUsed = isUsingBuffer && budgetSummary ? budgetSummary.totalCost - BUDGET_CONSTRAINTS.monthlyBudget : 0;
  const isOverTotalBudget = budgetSummary ? !budgetSummary.withinBudget : false;

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
            <div className="flex items-center space-x-3 text-sm">
              <DollarSign className={`h-4 w-4 ${isOverTotalBudget ? 'text-red-600' : isUsingBuffer ? 'text-orange-600' : 'text-green-600'}`} />
              <div className="flex flex-col items-end min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    ${budgetSummary?.totalCost.toLocaleString() || '0'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isOverTotalBudget
                      ? 'bg-red-100 text-red-800' 
                      : isUsingBuffer
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {Math.min(baseBudgetUtilization, 100).toFixed(1)}% base
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1 h-4">
                  <span>${BUDGET_CONSTRAINTS.monthlyBudget.toLocaleString()} base</span>
                  {isUsingBuffer ? (
                    <>
                      <span>+</span>
                      <span className={isOverTotalBudget ? 'text-red-600' : 'text-orange-600'}>
                        ${bufferUsed.toLocaleString()} buffer
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">+ ${BUDGET_CONSTRAINTS.premiumBuffer.toLocaleString()} buffer available</span>
                  )}
                </div>
              </div>
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