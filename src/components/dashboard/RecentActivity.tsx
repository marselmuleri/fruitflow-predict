import { Buah, FruitCategory } from '@/types/fruit';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface RecentActivityProps {
  fruits: Buah[];
}

const categoryStyles = {
  [FruitCategory.RIPE]: {
    bg: 'bg-orange-500/20',
    text: 'text-fruit-ripe',
    label: 'Matang',
  },
  [FruitCategory.UNRIPE]: {
    bg: 'bg-green-500/20',
    text: 'text-fruit-unripe',
    label: 'Mentah',
  },
  [FruitCategory.DAMAGED]: {
    bg: 'bg-red-500/20',
    text: 'text-fruit-damaged',
    label: 'Rusak',
  },
};

export function RecentActivity({ fruits }: RecentActivityProps) {
  const recentFruits = fruits.slice(-10).reverse();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Aktivitas Terbaru</h3>
        <p className="text-sm text-muted-foreground">10 buah terakhir yang terdeteksi</p>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {recentFruits.map((buah, index) => {
          const style = categoryStyles[buah.category];
          return (
            <div
              key={buah.id}
              className={cn(
                'flex items-center justify-between rounded-lg px-4 py-3 transition-all',
                'animate-fade-in bg-secondary/30 hover:bg-secondary/50'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn('rounded-full p-1.5', style.bg)}>
                  <Circle className={cn('h-3 w-3 fill-current', style.text)} />
                </div>
                <div>
                  <p className="text-sm font-mono text-foreground">{buah.id}</p>
                  <p className="text-xs text-muted-foreground">
                    RGB: ({Math.round(buah.rgbValues.r)}, {Math.round(buah.rgbValues.g)}, {Math.round(buah.rgbValues.b)})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={cn(
                  'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                  style.bg, style.text
                )}>
                  {style.label}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(buah.confidence * 100).toFixed(0)}% confidence
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
