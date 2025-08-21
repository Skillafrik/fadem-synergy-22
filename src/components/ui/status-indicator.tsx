
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  showDot?: boolean;
}

export const StatusIndicator = ({ 
  status, 
  label, 
  size = 'sm', 
  animated = false,
  showDot = true
}: StatusIndicatorProps) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string; dot: string }> = {
      // Statuts de paiement
      'a_jour': { 
        color: 'text-emerald-700', 
        bg: 'bg-emerald-50 border-emerald-200', 
        text: label || 'À jour',
        dot: 'bg-emerald-500'
      },
      'retard_leger': { 
        color: 'text-amber-700', 
        bg: 'bg-amber-50 border-amber-200', 
        text: label || 'Retard léger',
        dot: 'bg-amber-500'
      },
      'retard_important': { 
        color: 'text-red-700', 
        bg: 'bg-red-50 border-red-200', 
        text: label || 'Retard important',
        dot: 'bg-red-500'
      },
      'impaye': { 
        color: 'text-red-800', 
        bg: 'bg-red-100 border-red-300', 
        text: label || 'Impayé',
        dot: 'bg-red-600'
      },
      
      // Statuts de chambre
      'libre': { 
        color: 'text-green-700', 
        bg: 'bg-green-50 border-green-200', 
        text: label || 'Libre',
        dot: 'bg-green-500'
      },
      'occupee': { 
        color: 'text-blue-700', 
        bg: 'bg-blue-50 border-blue-200', 
        text: label || 'Occupée',
        dot: 'bg-blue-500'
      },
      'maintenance': { 
        color: 'text-orange-700', 
        bg: 'bg-orange-50 border-orange-200', 
        text: label || 'Maintenance',
        dot: 'bg-orange-500'
      },
      'reservee': { 
        color: 'text-purple-700', 
        bg: 'bg-purple-50 border-purple-200', 
        text: label || 'Réservée',
        dot: 'bg-purple-500'
      },
      
      // Statuts de contrat
      'actif': { 
        color: 'text-green-700', 
        bg: 'bg-green-50 border-green-200', 
        text: label || 'Actif',
        dot: 'bg-green-500'
      },
      'expire': { 
        color: 'text-red-700', 
        bg: 'bg-red-50 border-red-200', 
        text: label || 'Expiré',
        dot: 'bg-red-500'
      },
      'suspendu': { 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50 border-yellow-200', 
        text: label || 'Suspendu',
        dot: 'bg-yellow-500'
      }
    };
    
    return configs[status] || {
      color: 'text-gray-700', 
      bg: 'bg-gray-50 border-gray-200', 
      text: status,
      dot: 'bg-gray-500'
    };
  };

  const config = getStatusConfig(status);
  
  const sizes = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-sm px-4 py-2'
  };

  const dotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  return (
    <Badge 
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border',
        config.color,
        config.bg,
        sizes[size],
        'transition-all duration-200'
      )}
    >
      {showDot && (
        <span 
          className={cn(
            'rounded-full',
            config.dot,
            dotSizes[size],
            animated && 'animate-pulse'
          )}
        />
      )}
      {config.text}
    </Badge>
  );
};
