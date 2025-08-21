
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'bordered' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
}

export const ModernCard = ({ 
  title, 
  children, 
  className, 
  variant = 'default',
  size = 'md' 
}: ModernCardProps) => {
  const variants = {
    default: 'bg-card border-card-border',
    gradient: 'bg-gradient-surface border-0',
    bordered: 'bg-card border-2 border-primary/20',
    elevated: 'bg-card shadow-lg border-0'
  };

  const sizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      variants[variant],
      className
    )}>
      {title && (
        <CardHeader className={cn('pb-3', size === 'sm' && 'pb-2')}>
          <CardTitle className="text-fadem-black font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(sizes[size], title && 'pt-0')}>
        {children}
      </CardContent>
    </Card>
  );
};
