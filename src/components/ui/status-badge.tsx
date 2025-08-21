
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({ status, variant = 'default', size = 'md' }: StatusBadgeProps) => {
  const getVariantFromStatus = (status: string) => {
    const statusMap: Record<string, typeof variant> = {
      'actif': 'default',
      'paye': 'default',
      'a_jour': 'default',
      'disponible': 'default',
      'libre': 'default',
      
      'en_retard': 'secondary',
      'retard_leger': 'secondary',
      'suspendu': 'secondary',
      'maintenance': 'secondary',
      
      'resilié': 'destructive',
      'impaye': 'destructive',
      'retard_important': 'destructive',
      'annule': 'destructive',
      
      'en_cours': 'outline',
      'occupee': 'outline',
      'loue': 'outline',
      'reserve': 'outline'
    };
    
    return statusMap[status] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'a_jour': 'bg-green-100 text-green-800 border-green-200',
      'retard_leger': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'retard_important': 'bg-red-100 text-red-800 border-red-200',
      'impaye': 'bg-red-100 text-red-800 border-red-200',
      'libre': 'bg-green-100 text-green-800 border-green-200',
      'occupee': 'bg-blue-100 text-blue-800 border-blue-200',
      'maintenance': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return colorMap[status] || '';
  };

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const finalVariant = variant === 'default' ? getVariantFromStatus(status) : variant;
  const customColor = getStatusColor(status);

  return (
    <Badge 
      variant={finalVariant} 
      className={cn(
        sizes[size], 
        'font-medium',
        customColor && customColor
      )}
    >
      {status}
    </Badge>
  );
};
