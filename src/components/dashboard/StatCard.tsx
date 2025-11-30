import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'ripe' | 'unripe' | 'damaged' | 'total';
  trend?: number;
  suffix?: string;
}

const variantStyles = {
  ripe: {
    bg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/30',
    text: 'text-fruit-ripe',
    glow: 'shadow-[0_0_30px_hsl(28,95%,55%,0.2)]',
    icon: 'text-orange-400',
  },
  unripe: {
    bg: 'bg-gradient-to-br from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    text: 'text-fruit-unripe',
    glow: 'shadow-[0_0_30px_hsl(145,60%,45%,0.2)]',
    icon: 'text-green-400',
  },
  damaged: {
    bg: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
    border: 'border-red-500/30',
    text: 'text-fruit-damaged',
    glow: 'shadow-[0_0_30px_hsl(0,72%,51%,0.2)]',
    icon: 'text-red-400',
  },
  total: {
    bg: 'bg-gradient-to-br from-primary/20 to-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    glow: 'shadow-[0_0_30px_hsl(28,95%,55%,0.15)]',
    icon: 'text-primary',
  },
};

export function StatCard({ title, value, icon: Icon, variant, trend, suffix = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const styles = variantStyles[variant];

  // Animate counter
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02]',
        styles.bg,
        styles.border,
        styles.glow
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn('stat-counter mt-2', styles.text)}>
            {displayValue.toLocaleString()}
            {suffix && <span className="text-2xl ml-1">{suffix}</span>}
          </p>
          {trend !== undefined && (
            <p className={cn(
              'mt-2 text-sm font-medium',
              trend >= 0 ? 'text-fruit-unripe' : 'text-fruit-damaged'
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% dari jam sebelumnya
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-3', styles.bg)}>
          <Icon className={cn('h-6 w-6', styles.icon)} />
        </div>
      </div>
      
      {/* Decorative element */}
      <div className={cn(
        'absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-10',
        variant === 'ripe' && 'bg-orange-500',
        variant === 'unripe' && 'bg-green-500',
        variant === 'damaged' && 'bg-red-500',
        variant === 'total' && 'bg-primary'
      )} />
    </div>
  );
}
