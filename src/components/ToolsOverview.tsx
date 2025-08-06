
import { TOOLS, BUDGET_CONSTRAINTS } from '../data';
import { CheckCircle, Clock, DollarSign } from 'lucide-react';

export function ToolsOverview() {
  const approvedTools = TOOLS.filter(tool => tool.type === 'approved');
  const experimentalTools = TOOLS.filter(tool => tool.type === 'experimental');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Constraints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Monthly Budget</h3>
            <p className="text-2xl font-bold text-blue-700">
              ${BUDGET_CONSTRAINTS.totalMonthlyBudget.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">
              ${BUDGET_CONSTRAINTS.monthlyBudget.toLocaleString()} + ${BUDGET_CONSTRAINTS.premiumBuffer.toLocaleString()} buffer
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900">Max Cost/User</h3>
            <p className="text-2xl font-bold text-green-700">
              ${BUDGET_CONSTRAINTS.maxUserCost}
            </p>
            <p className="text-sm text-green-600">Per user per month</p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-medium text-orange-900">Experimental Limit</h3>
            <p className="text-2xl font-bold text-orange-700">
              {BUDGET_CONSTRAINTS.maxExperimentalTools}
            </p>
            <p className="text-sm text-orange-600">Max tools under experiment</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900">Users/Experiment</h3>
            <p className="text-2xl font-bold text-purple-700">
              {BUDGET_CONSTRAINTS.maxUsersPerExperimentalTool}
            </p>
            <p className="text-sm text-purple-600">Max users per experimental tool</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Approved Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedTools.map(tool => (
            <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{tool.category}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-bold text-gray-900">${tool.price}</span>
                  <span className="text-sm text-gray-500">/user/month</span>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  tool.price <= BUDGET_CONSTRAINTS.maxUserCost
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tool.price <= BUDGET_CONSTRAINTS.maxUserCost ? 'Within limit' : 'Over limit'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Experimental Tools</h2>
        </div>
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>Experimental Tools Constraints:</strong> Maximum of {BUDGET_CONSTRAINTS.maxExperimentalTools} tools 
            can be under experimentation at any time, with up to {BUDGET_CONSTRAINTS.maxUsersPerExperimentalTool} users 
            per experimental tool.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experimentalTools.map(tool => (
            <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  Experimental
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{tool.category}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-bold text-gray-900">${tool.price}</span>
                  <span className="text-sm text-gray-500">/user/month</span>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  tool.price <= BUDGET_CONSTRAINTS.maxUserCost
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tool.price <= BUDGET_CONSTRAINTS.maxUserCost ? 'Within limit' : 'Over limit'}
                </div>
              </div>
              {tool.price > BUDGET_CONSTRAINTS.maxUserCost && (
                <div className="mt-2 text-xs text-red-600">
                  Exceeds ${BUDGET_CONSTRAINTS.maxUserCost} user cost limit
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}