
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UltraCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated' | 'interactive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  loading?: boolean;
  badge?: string;
  icon?: React.ReactNode;
}

export const UltraCard = ({ 
  title, 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  onClick,
  loading = false,
  badge,
  icon
}: UltraCardProps) => {
  const variants = {
    default: 'bg-card border-border hover:border-border/60',
    gradient: 'bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-md',
    glass: 'bg-card/80 backdrop-blur-sm border-border/50 shadow-lg',
    elevated: 'bg-card shadow-2xl border-0 hover:shadow-3xl',
    interactive: 'bg-card border-border hover:bg-accent/5 hover:border-primary/40 cursor-pointer'
  };

  const sizes = {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const MotionCard = onClick ? motion.div : 'div';

  return (
    <MotionCard
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-out',
        variants[variant],
        onClick && 'transform hover:scale-[1.02] active:scale-[0.98]',
        loading && 'pointer-events-none opacity-70',
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <Card className="border-0 bg-transparent shadow-none">
        {(title || badge || icon) && (
          <CardHeader className={cn('pb-3 relative', size === 'xs' && 'pb-2')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {icon && (
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {icon}
                  </div>
                )}
                {title && (
                  <CardTitle className="text-foreground font-semibold text-lg">
                    {title}
                  </CardTitle>
                )}
              </div>
              {badge && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {badge}
                </span>
              )}
            </div>
          </CardHeader>
        )}
        <CardContent className={cn(sizes[size], title && 'pt-0')}>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>

      {/* Decorative gradient overlay for interactive cards */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </MotionCard>
  );
};
