import { Citrus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onRefresh: () => void;
  lastUpdate: Date;
}

export function Header({ onRefresh, lastUpdate }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 shadow-lg shadow-orange-500/20">
              <Citrus className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Orange<span className="text-primary">Sort</span> Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Sistem Conveyor Penyortir Buah Jeruk - IoT & AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Terakhir diperbarui</p>
              <p className="text-sm font-mono text-foreground">
                {lastUpdate.toLocaleTimeString('id-ID')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex items-center gap-2 rounded-full bg-fruit-unripe/20 px-3 py-1.5 border border-fruit-unripe/30">
              <div className="h-2 w-2 rounded-full bg-fruit-unripe animate-pulse" />
              <span className="text-xs font-medium text-fruit-unripe">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
