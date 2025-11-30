import { Buah, DataLogger, Predictor, FruitCategory, HourlyData, PredictionData, SystemStatus } from '@/types/fruit';

// ============================================
// DUMMY DATA GENERATOR
// ============================================

// Generate random RGB values based on category
function generateRGB(category: FruitCategory): { r: number; g: number; b: number } {
  switch (category) {
    case FruitCategory.RIPE:
      return { r: 200 + Math.random() * 55, g: 100 + Math.random() * 50, b: 20 + Math.random() * 30 };
    case FruitCategory.UNRIPE:
      return { r: 100 + Math.random() * 50, g: 180 + Math.random() * 75, b: 50 + Math.random() * 50 };
    case FruitCategory.DAMAGED:
      return { r: 80 + Math.random() * 40, g: 60 + Math.random() * 30, b: 40 + Math.random() * 30 };
  }
}

// Generate random category with weighted probability
function generateCategory(): FruitCategory {
  const rand = Math.random();
  if (rand < 0.6) return FruitCategory.RIPE;
  if (rand < 0.85) return FruitCategory.UNRIPE;
  return FruitCategory.DAMAGED;
}

// Create DataLogger with dummy data
export function createDummyDataLogger(): DataLogger {
  const logger = new DataLogger(500);
  
  // Generate 100 dummy fruit entries
  for (let i = 0; i < 100; i++) {
    const category = generateCategory();
    const buah = new Buah(
      `FRUIT-${String(i + 1).padStart(4, '0')}`,
      category,
      generateRGB(category),
      0.85 + Math.random() * 0.15
    );
    logger.addLog(buah);
  }
  
  return logger;
}

// Create Predictor with dummy historical data
export function createDummyPredictor(): Predictor {
  const predictor = new Predictor();
  
  // Add dummy historical data (hourly ripe fruit counts)
  const historicalData = [45, 52, 48, 61, 55, 58, 63, 67, 72, 68, 75, 70];
  historicalData.forEach(value => predictor.addDataPoint(value));
  predictor.train();
  
  return predictor;
}

// Generate dummy hourly data for charts
export function generateDummyHourlyData(): HourlyData[] {
  const data: HourlyData[] = [];
  const currentHour = new Date().getHours();
  
  for (let i = 0; i < 12; i++) {
    const hour = ((currentHour - 11 + i + 24) % 24).toString().padStart(2, '0') + ':00';
    const ripe = 40 + Math.floor(Math.random() * 40);
    const unripe = 15 + Math.floor(Math.random() * 20);
    const damaged = 5 + Math.floor(Math.random() * 10);
    
    data.push({
      hour,
      ripe,
      unripe,
      damaged,
      total: ripe + unripe + damaged,
    });
  }
  
  return data;
}

// Generate dummy prediction data
export function generateDummyPredictions(): PredictionData[] {
  const predictor = createDummyPredictor();
  const predictions = predictor.getPredictions(8);
  
  // Add some actual data for comparison
  predictions.slice(0, 4).forEach((p, i) => {
    p.actual = p.predicted + Math.floor((Math.random() - 0.5) * 10);
  });
  
  return predictions;
}

// Dummy system status
export function getDummySystemStatus(): SystemStatus {
  return {
    conveyorRunning: true,
    sensorActive: true,
    cameraActive: true,
    cloudConnected: true,
  };
}

// Generate new fruit (for real-time simulation)
export function generateNewFruit(): Buah {
  const category = generateCategory();
  return new Buah(
    `FRUIT-${Date.now()}`,
    category,
    generateRGB(category),
    0.85 + Math.random() * 0.15
  );
}

// Initial stats
export function getInitialStats() {
  return {
    total: 1247,
    ripe: 748,
    unripe: 374,
    damaged: 125,
    lastUpdated: new Date(),
  };
}
