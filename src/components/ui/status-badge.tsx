
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({ status, variant = 'default', size = 'md' }: StatusBadgeProps) => {
  const getVariantFromStatus = (status: string) => {
    const statusMap: Record<string, typeof variant> = {
      'actif': 'success',
      'paye': 'success',
      'a_jour': 'success',
      'disponible': 'success',
      'libre': 'success',
      
      'en_retard': 'warning',
      'retard_leger': 'warning',
      'suspendu': 'warning',
      'maintenance': 'warning',
      
      'resilié': 'destructive',
      'impaye': 'destructive',
      'retard_important': 'destructive',
      'annule': 'destructive',
      
      'en_cours': 'info',
      'occupee': 'info',
      'loue': 'info',
      'reserve': 'info'
    };
    
    return statusMap[status] || 'default';
  };

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const finalVariant = variant === 'default' ? getVariantFromStatus(status) : variant;

  return (
    <Badge 
      variant={finalVariant} 
      className={cn(sizes[size], 'font-medium')}
    >
      {status}
    </Badge>
  );
};
