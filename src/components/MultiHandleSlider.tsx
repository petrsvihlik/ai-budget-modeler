import React, { useState, useRef, useCallback } from 'react';
import { ToolAssignment } from '../types';
import { TOOLS, TEAMS } from '../data';

interface MultiHandleSliderProps {
  assignments: ToolAssignment[];
  onAssignmentsChange: (assignments: ToolAssignment[]) => void;
  totalBudget: number;
}

interface SliderSegment {
  id: string;
  assignment: ToolAssignment;
  tool: any;
  team: any;
  start: number;
  end: number;
  color: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

export function MultiHandleSlider({ assignments, onAssignmentsChange, totalBudget }: MultiHandleSliderProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartValue, setDragStartValue] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Calculate total users across all assignments
  const totalUsers = assignments.reduce((sum, assignment) => sum + assignment.userCount, 0);
  const maxUsers = Math.max(totalUsers, 100); // Minimum scale of 100
  
  // Create segments for visualization
  const segments: SliderSegment[] = [];
  let currentPos = 0;
  
  assignments.forEach((assignment, index) => {
    const tool = TOOLS.find(t => t.id === assignment.toolId);
    const team = TEAMS.find(t => t.id === assignment.teamId);
    
    if (tool && team) {
      const segmentWidth = (assignment.userCount / maxUsers) * 100;
      segments.push({
        id: `${assignment.teamId}-${assignment.toolId}`,
        assignment,
        tool,
        team,
        start: currentPos,
        end: currentPos + segmentWidth,
        color: COLORS[index % COLORS.length]
      });
      currentPos += segmentWidth;
    }
  });

  const handleMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    setDragIndex(index);
    setDragStartX(e.clientX);
    setDragStartValue(assignments[index].userCount);
    e.preventDefault();
  }, [assignments]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragIndex === null || !sliderRef.current || dragStartX === null || dragStartValue === null) return;
    
    const currentAssignment = assignments[dragIndex];
    const team = TEAMS.find(t => t.id === currentAssignment.teamId);
    if (!team) return;
    
    // Calculate total users already assigned to this team (excluding current assignment)
    const teamTotalUsers = assignments.reduce((sum, assignment, index) => {
      if (assignment.teamId === currentAssignment.teamId && index !== dragIndex) {
        return sum + assignment.userCount;
      }
      return sum;
    }, 0);
    
    // Maximum users available for this assignment = team size - other assignments
    const maxAvailableUsers = team.memberCount - teamTotalUsers;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartX;
    const deltaPercent = (deltaX / rect.width) * 100;
    const deltaUsers = Math.round((deltaPercent / 100) * maxUsers);
    const newUserCount = Math.max(1, Math.min(maxAvailableUsers, dragStartValue + deltaUsers));
    
    const newAssignments = [...assignments];
    newAssignments[dragIndex] = {
      ...newAssignments[dragIndex],
      userCount: newUserCount
    };
    
    onAssignmentsChange(newAssignments);
  }, [dragIndex, assignments, onAssignmentsChange, maxUsers, dragStartX, dragStartValue]);

  const handleMouseUp = useCallback(() => {
    setDragIndex(null);
    setDragStartX(null);
    setDragStartValue(null);
  }, []);

  React.useEffect(() => {
    if (dragIndex !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragIndex, handleMouseMove, handleMouseUp]);

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Add some tool assignments to see the multi-handle slider
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Total Users Distribution</h4>
        <div className="text-2xl font-bold text-blue-600">{totalUsers} users</div>
        <div className="text-sm text-gray-500">Total Cost: ${assignments.reduce((sum, a) => {
          const tool = TOOLS.find(t => t.id === a.toolId);
          return sum + (tool ? tool.price * a.userCount : 0);
        }, 0).toLocaleString()}</div>
      </div>

      {/* Multi-handle slider */}
      <div className="relative">
        <div 
          ref={sliderRef}
          className="relative h-12 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
          style={{ minWidth: '400px' }}
        >
          {/* Segments */}
          {segments.map((segment, index) => (
            <div
              key={segment.id}
              className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium transition-all duration-200 hover:brightness-110"
              style={{
                left: `${segment.start}%`,
                width: `${segment.end - segment.start}%`,
                backgroundColor: segment.color
              }}
            >
              {segment.end - segment.start > 10 && (
                <span className="truncate px-1">
                  {segment.team.name} ({segment.assignment.userCount})
                </span>
              )}
            </div>
          ))}
          
          {/* Handles */}
          {segments.map((segment, index) => (
            <div
              key={`handle-${segment.id}`}
              className="absolute top-0 w-4 h-12 bg-white border-2 border-gray-400 rounded cursor-grab active:cursor-grabbing shadow-lg hover:border-blue-500 transition-colors"
              style={{
                left: `calc(${segment.end}% - 8px)`,
                zIndex: 10
              }}
                             onMouseDown={(e) => handleMouseDown(index, e)}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-gray-400 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Scale markers */}
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0</span>
          <span>{Math.round(maxUsers * 0.25)}</span>
          <span>{Math.round(maxUsers * 0.5)}</span>
          <span>{Math.round(maxUsers * 0.75)}</span>
          <span>{maxUsers}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {segments.map((segment, index) => {
            // Calculate team utilization
            const teamTotalUsers = assignments.reduce((sum, assignment) => {
              if (assignment.teamId === segment.assignment.teamId) {
                return sum + assignment.userCount;
              }
              return sum;
            }, 0);
            const teamUtilization = (teamTotalUsers / segment.team.memberCount) * 100;
            
            return (
              <div key={segment.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {segment.team.name} → {segment.tool.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {segment.assignment.userCount} users • ${(segment.tool.price * segment.assignment.userCount).toLocaleString()}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  segment.tool.type === 'experimental' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {segment.tool.type}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Team Utilization Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">Team Utilization</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEAMS.filter(team => team.id !== 'external').map(team => {
              const teamTotalUsers = assignments.reduce((sum, assignment) => {
                if (assignment.teamId === team.id) {
                  return sum + assignment.userCount;
                }
                return sum;
              }, 0);
              const utilizationPercent = (teamTotalUsers / team.memberCount) * 100;
              const availableUsers = team.memberCount - teamTotalUsers;
              
              return (
                <div key={team.id} className="text-center">
                  <div className="text-sm font-medium text-gray-900">{team.name}</div>
                  <div className={`text-lg font-bold ${utilizationPercent > 100 ? 'text-red-600' : utilizationPercent > 80 ? 'text-orange-600' : 'text-green-600'}`}>
                    {teamTotalUsers}/{team.memberCount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {availableUsers >= 0 ? `${availableUsers} available` : `${Math.abs(availableUsers)} over limit`}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${utilizationPercent > 100 ? 'bg-red-500' : utilizationPercent > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, utilizationPercent)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 