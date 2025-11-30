import { SystemStatus as SystemStatusType } from '@/types/fruit';
import { Activity, Camera, Cloud, Cpu, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemStatusProps {
  status: SystemStatusType;
}

export function SystemStatus({ status }: SystemStatusProps) {
  const statusItems = [
    { label: 'Conveyor', active: status.conveyorRunning, icon: Power },
    { label: 'Sensor Warna', active: status.sensorActive, icon: Cpu },
    { label: 'AI Camera', active: status.cameraActive, icon: Camera },
    { label: 'Cloud IoT', active: status.cloudConnected, icon: Cloud },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Status Sistem</h3>
      </div>
      
      <div className="space-y-3">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                'h-5 w-5',
                item.active ? 'text-fruit-unripe' : 'text-muted-foreground'
              )} />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'h-2.5 w-2.5 rounded-full',
                item.active ? 'bg-fruit-unripe animate-pulse' : 'bg-fruit-damaged'
              )} />
              <span className={cn(
                'text-xs font-medium',
                item.active ? 'text-fruit-unripe' : 'text-fruit-damaged'
              )}>
                {item.active ? 'AKTIF' : 'OFFLINE'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 rounded-lg bg-primary/10 p-3 border border-primary/20">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-fruit-unripe animate-pulse" />
          <span className="text-xs text-muted-foreground">Sistem berjalan normal</span>
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">
          Kecepatan Conveyor: <span className="text-primary">15 cm/s</span>
        </p>
      </div>
    </div>
  );
}
