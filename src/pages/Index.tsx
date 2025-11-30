import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/dashboard/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { SortingChart } from '@/components/dashboard/SortingChart';
import { PredictionChart } from '@/components/dashboard/PredictionChart';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ConveyorVisual } from '@/components/dashboard/ConveyorVisual';
import { 
  generateDummyHourlyData, 
  generateDummyPredictions, 
  getDummySystemStatus,
  createDummyDataLogger,
  createDummyPredictor,
  generateNewFruit,
  getInitialStats
} from '@/data/dummyData';
import { Buah, SortingStats, HourlyData, PredictionData, SystemStatus as SystemStatusType, FruitCategory } from '@/types/fruit';
import { Apple, CircleDot, AlertTriangle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [stats, setStats] = useState<SortingStats>(getInitialStats());
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatusType>(getDummySystemStatus());
  const [recentFruits, setRecentFruits] = useState<Buah[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [predictor] = useState(() => createDummyPredictor());

  // Initialize data
  useEffect(() => {
    const logger = createDummyDataLogger();
    setRecentFruits(logger.getLogs());
    setHourlyData(generateDummyHourlyData());
    setPredictions(generateDummyPredictions());
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newFruit = generateNewFruit();
      
      setRecentFruits(prev => [...prev.slice(-99), newFruit]);
      
      setStats(prev => {
        const updated = { ...prev, total: prev.total + 1, lastUpdated: new Date() };
        switch (newFruit.category) {
          case FruitCategory.RIPE:
            updated.ripe++;
            break;
          case FruitCategory.UNRIPE:
            updated.unripe++;
            break;
          case FruitCategory.DAMAGED:
            updated.damaged++;
            break;
        }
        return updated;
      });

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setHourlyData(generateDummyHourlyData());
    setPredictions(generateDummyPredictions());
    setLastUpdate(new Date());
    toast.success('Data berhasil diperbarui!');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={handleRefresh} lastUpdate={lastUpdate} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Buah"
            value={stats.total}
            icon={BarChart3}
            variant="total"
            trend={12}
          />
          <StatCard
            title="Buah Matang"
            value={stats.ripe}
            icon={Apple}
            variant="ripe"
            trend={8}
          />
          <StatCard
            title="Buah Mentah"
            value={stats.unripe}
            icon={CircleDot}
            variant="unripe"
            trend={-3}
          />
          <StatCard
            title="Buah Rusak"
            value={stats.damaged}
            icon={AlertTriangle}
            variant="damaged"
            trend={2}
          />
        </section>

        {/* Conveyor Visualization */}
        <section className="mb-6">
          <ConveyorVisual />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SortingChart data={hourlyData} />
          <PredictionChart data={predictions} accuracy={predictor.getAccuracy()} />
        </section>

        {/* Bottom Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity fruits={recentFruits} />
          </div>
          <SystemStatus status={systemStatus} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>OrangeSort Dashboard v1.0 - Sistem Conveyor Penyortir Buah Jeruk</p>
          <p className="mt-1">Proyek IoT & AI - Pemrograman Berorientasi Objek (PBO)</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
