
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
  default: 'text-credipal-green',
  positive: 'text-credipal-green',
  warning: 'text-amber-500',
  neutral: 'text-slate-600'
};

const iconVariantStyles = {
  default: 'text-credipal-green bg-credipal-green-bg',
  positive: 'text-credipal-green bg-credipal-green-bg', 
  warning: 'text-amber-500 bg-amber-50',
  neutral: 'text-slate-600 bg-slate-100'
};

const trendColors = {
  up: 'text-credipal-green',
  down: 'text-amber-500'
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  variant = 'default'
}) => {
  return (
    <Card className="bg-white rounded-2xl p-6 shadow-clean border border-gray-100 hover-clean group">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconVariantStyles[variant]} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${trendColors[trend.direction]}`}>
              <span className="text-xs mr-1">
                {trend.direction === 'up' ? '↗' : '↘'}
              </span>
              {trend.percentage}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-3xl font-bold ${variantStyles[variant]} group-hover:scale-105 transition-transform duration-200`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
