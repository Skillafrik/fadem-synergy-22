
import React from 'react';
import { UltraCard } from './ultra-card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label?: string;
  };
  icon?: React.ReactNode;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'default',
  loading = false
}: MetricCardProps) => {
  const colors = {
    default: 'text-foreground',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
    info: 'text-blue-600'
  };

  const bgColors = {
    default: 'bg-muted/10',
    success: 'bg-emerald-50',
    warning: 'bg-amber-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend.value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) return 'text-emerald-600';
    if (trend.value < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <UltraCard 
      variant="glass" 
      size="md"
      loading={loading}
      className={cn('relative overflow-hidden', bgColors[color])}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && (
            <div className={cn('p-1.5 rounded-lg', bgColors[color])}>
              <div className={cn('w-4 h-4', colors[color])}>
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <div className={cn('text-2xl font-bold', colors[color])}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {/* Subtitle and trend */}
          <div className="flex items-center justify-between text-sm">
            {subtitle && (
              <span className="text-muted-foreground">{subtitle}</span>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1', getTrendColor())}>
                {getTrendIcon()}
                <span className="font-medium">
                  {Math.abs(trend.value)}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </UltraCard>
  );
};
