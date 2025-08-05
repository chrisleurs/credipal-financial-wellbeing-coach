
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  actionSteps?: string[];
}

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress?: (goalId: string, progress: number) => void;
  variant?: 'short' | 'medium' | 'long';
  prominent?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onUpdateProgress, 
  variant = 'short',
  prominent = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const progress = goal.currentAmount && goal.targetAmount 
    ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
    : 0;

  const getVariantColors = () => {
    switch (variant) {
      case 'short':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          accent: 'text-green-600',
          badge: 'bg-green-100 text-green-800'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          accent: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'long':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          accent: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          accent: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const statusMap = {
      pending: { label: 'Pendiente', variant: 'secondary' },
      in_progress: { label: 'En Progreso', variant: 'default' },
      completed: { label: 'Completada', variant: 'default' }
    };
    return statusMap[goal.status];
  };

  const colors = getVariantColors();
  const statusBadge = getStatusBadge();

  // Progress ring data for Recharts
  const progressData = [
    { name: 'completed', value: progress },
    { name: 'remaining', value: 100 - progress }
  ];

  const COLORS = {
    completed: variant === 'short' ? '#10b981' : variant === 'medium' ? '#3b82f6' : '#8b5cf6',
    remaining: '#e5e7eb'
  };

  const handleUpdateProgress = async () => {
    if (!onUpdateProgress) return;
    
    setIsUpdating(true);
    try {
      await onUpdateProgress(goal.id, progress + 10); // Increment by 10% as example
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={`${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-lg ${prominent ? 'ring-2 ring-purple-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={colors.badge}>
              {statusBadge.label}
            </Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            {goal.priority}
          </Badge>
        </div>
        
        <CardTitle className={`text-lg ${colors.accent} ${prominent ? 'text-xl' : ''}`}>
          {goal.title}
        </CardTitle>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {goal.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={30}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${colors.accent}`}>
                {progress}%
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>${goal.currentAmount?.toLocaleString() || '0'}</span>
              <span>${goal.targetAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Target Amount and Deadline */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Meta:</span>
            <span className="font-medium">${goal.targetAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">{new Date(goal.deadline).toLocaleDateString('es-ES')}</span>
          </div>
        </div>

        {/* Action Steps - Expandible */}
        {goal.actionSteps && goal.actionSteps.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between p-2 h-auto"
            >
              <span className="text-sm font-medium">Pasos de Acción</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {isExpanded && (
              <div className="mt-2 space-y-2">
                {goal.actionSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Update Progress Button */}
        {onUpdateProgress && goal.status !== 'completed' && (
          <Button
            onClick={handleUpdateProgress}
            disabled={isUpdating}
            className="w-full"
            variant="outline"
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar Progreso'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
