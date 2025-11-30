import { cn } from '@/lib/utils';
import { FruitCategory } from '@/types/fruit';
import { useEffect, useState } from 'react';

interface FruitOnBelt {
  id: number;
  category: FruitCategory;
  position: number;
}

export function ConveyorVisual() {
  const [fruits, setFruits] = useState<FruitOnBelt[]>([]);

  useEffect(() => {
    // Add new fruit periodically
    const addInterval = setInterval(() => {
      const categories = [FruitCategory.RIPE, FruitCategory.UNRIPE, FruitCategory.DAMAGED];
      const weights = [0.6, 0.25, 0.15];
      const rand = Math.random();
      let category = FruitCategory.RIPE;
      if (rand > weights[0]) category = FruitCategory.UNRIPE;
      if (rand > weights[0] + weights[1]) category = FruitCategory.DAMAGED;

      setFruits(prev => [...prev, {
        id: Date.now(),
        category,
        position: 0,
      }]);
    }, 2000);

    // Move fruits
    const moveInterval = setInterval(() => {
      setFruits(prev => prev
        .map(f => ({ ...f, position: f.position + 2 }))
        .filter(f => f.position < 100)
      );
    }, 100);

    return () => {
      clearInterval(addInterval);
      clearInterval(moveInterval);
    };
  }, []);

  const getFruitColor = (category: FruitCategory) => {
    switch (category) {
      case FruitCategory.RIPE: return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case FruitCategory.UNRIPE: return 'bg-gradient-to-br from-green-400 to-green-600';
      case FruitCategory.DAMAGED: return 'bg-gradient-to-br from-red-400 to-red-600';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Visualisasi Conveyor</h3>
        <p className="text-sm text-muted-foreground">Simulasi real-time pergerakan buah</p>
      </div>

      <div className="relative h-32 rounded-lg bg-secondary/50 overflow-hidden">
        {/* Conveyor belt pattern */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-r from-secondary via-muted to-secondary">
          <div className="h-full w-[200%] animate-conveyor flex">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="h-full w-8 border-r border-border/30" />
            ))}
          </div>
        </div>

        {/* Sensor zone */}
        <div className="absolute left-1/2 top-0 bottom-8 w-16 -translate-x-1/2 border-2 border-dashed border-primary/50 bg-primary/10 flex items-center justify-center">
          <span className="text-[10px] font-medium text-primary rotate-90 whitespace-nowrap">SENSOR</span>
        </div>

        {/* Fruits on belt */}
        {fruits.map(fruit => (
          <div
            key={fruit.id}
            className={cn(
              'absolute bottom-10 h-8 w-8 rounded-full shadow-lg transition-all duration-100',
              getFruitColor(fruit.category)
            )}
            style={{
              left: `${fruit.position}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="absolute inset-1 rounded-full bg-white/20" />
          </div>
        ))}

        {/* Entry label */}
        <div className="absolute left-2 top-2 text-xs text-muted-foreground">
          ← Masuk
        </div>

        {/* Sorted zones */}
        <div className="absolute right-2 top-2 flex gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-fruit-ripe" />
            <span className="text-[10px] text-muted-foreground">Matang</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-fruit-unripe" />
            <span className="text-[10px] text-muted-foreground">Mentah</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-fruit-damaged" />
            <span className="text-[10px] text-muted-foreground">Rusak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
