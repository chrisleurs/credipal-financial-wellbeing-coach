
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: string;
  };
  icon: LucideIcon;
  variant?: 'default' | 'positive' | 'warning' | 'neutral';
}

const variantStyles = {
  default: 'text-primary',
  positive: 'text-emerald-600',
  warning: 'text-amber-500',
  neutral: 'text-slate-600'
};

const trendColors = {
  up: 'text-emerald-600',
  down: 'text-red-500'
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  variant = 'default'
}) => {
  return (
    <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-3">
          <Icon className={`h-5 w-5 ${variantStyles[variant]} group-hover:scale-110 transition-transform duration-200`} />
          {trend && (
            <div className={`flex items-center text-sm font-medium ${trendColors[trend.direction]}`}>
              <span className="text-xs mr-1">
                {trend.direction === 'up' ? '↗' : '↘'}
              </span>
              {trend.percentage}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-3xl font-bold ${variantStyles[variant]} group-hover:scale-105 transition-transform duration-200`}>
            {value}
          </p>
        </div>
        
        {/* Mini trend line background - subtle */}
        <div className="absolute inset-0 opacity-5 overflow-hidden rounded-2xl">
          <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
        </div>
      </CardContent>
    </Card>
  );
};
