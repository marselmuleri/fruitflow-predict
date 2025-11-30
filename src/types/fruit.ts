// ============================================
// CLASS & TYPES - Penerapan PBO (OOP)
// ============================================

// Interface untuk data buah
export interface FruitData {
  id: string;
  timestamp: Date;
  category: FruitCategory;
  rgbValues: RGBValue;
  confidence: number;
}

// Enum untuk kategori buah
export enum FruitCategory {
  RIPE = 'matang',
  UNRIPE = 'mentah',
  DAMAGED = 'rusak',
}

// Interface untuk nilai RGB dari sensor warna
export interface RGBValue {
  r: number;
  g: number;
  b: number;
}

// Interface untuk statistik sortir
export interface SortingStats {
  total: number;
  ripe: number;
  unripe: number;
  damaged: number;
  lastUpdated: Date;
}

// Interface untuk data prediksi
export interface PredictionData {
  hour: string;
  actual: number | null;
  predicted: number;
}

// Interface untuk data historis per jam
export interface HourlyData {
  hour: string;
  ripe: number;
  unripe: number;
  damaged: number;
  total: number;
}

// Interface untuk status sistem
export interface SystemStatus {
  conveyorRunning: boolean;
  sensorActive: boolean;
  cameraActive: boolean;
  cloudConnected: boolean;
}

// ============================================
// CLASS Buah - Contoh Penerapan OOP
// ============================================
export class Buah {
  private _id: string;
  private _timestamp: Date;
  private _category: FruitCategory;
  private _rgbValues: RGBValue;
  private _confidence: number;

  constructor(
    id: string,
    category: FruitCategory,
    rgbValues: RGBValue,
    confidence: number = 0.95
  ) {
    this._id = id;
    this._timestamp = new Date();
    this._category = category;
    this._rgbValues = rgbValues;
    this._confidence = confidence;
  }

  // Getter methods (Encapsulation)
  get id(): string {
    return this._id;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get category(): FruitCategory {
    return this._category;
  }

  get rgbValues(): RGBValue {
    return this._rgbValues;
  }

  get confidence(): number {
    return this._confidence;
  }

  // Method untuk mendapatkan label kategori
  getCategoryLabel(): string {
    const labels: Record<FruitCategory, string> = {
      [FruitCategory.RIPE]: 'Matang',
      [FruitCategory.UNRIPE]: 'Mentah',
      [FruitCategory.DAMAGED]: 'Rusak',
    };
    return labels[this._category];
  }

  // Method untuk konversi ke plain object
  toJSON(): FruitData {
    return {
      id: this._id,
      timestamp: this._timestamp,
      category: this._category,
      rgbValues: this._rgbValues,
      confidence: this._confidence,
    };
  }
}

// ============================================
// CLASS DataLogger - Mencatat data sortir
// ============================================
export class DataLogger {
  private _logs: Buah[] = [];
  private _maxLogs: number;

  constructor(maxLogs: number = 1000) {
    this._maxLogs = maxLogs;
  }

  // Method untuk menambah log
  addLog(buah: Buah): void {
    this._logs.push(buah);
    // Hapus log lama jika melebihi batas
    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
    }
  }

  // Method untuk mendapatkan semua log
  getLogs(): Buah[] {
    return [...this._logs];
  }

  // Method untuk mendapatkan statistik
  getStats(): SortingStats {
    const stats: SortingStats = {
      total: this._logs.length,
      ripe: 0,
      unripe: 0,
      damaged: 0,
      lastUpdated: new Date(),
    };

    this._logs.forEach((buah) => {
      switch (buah.category) {
        case FruitCategory.RIPE:
          stats.ripe++;
          break;
        case FruitCategory.UNRIPE:
          stats.unripe++;
          break;
        case FruitCategory.DAMAGED:
          stats.damaged++;
          break;
      }
    });

    return stats;
  }

  // Method untuk mendapatkan data per jam
  getHourlyData(): HourlyData[] {
    const hourlyMap = new Map<string, HourlyData>();

    this._logs.forEach((buah) => {
      const hour = buah.timestamp.getHours().toString().padStart(2, '0') + ':00';
      
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { hour, ripe: 0, unripe: 0, damaged: 0, total: 0 });
      }

      const data = hourlyMap.get(hour)!;
      data.total++;
      
      switch (buah.category) {
        case FruitCategory.RIPE:
          data.ripe++;
          break;
        case FruitCategory.UNRIPE:
          data.unripe++;
          break;
        case FruitCategory.DAMAGED:
          data.damaged++;
          break;
      }
    });

    return Array.from(hourlyMap.values()).sort((a, b) => a.hour.localeCompare(b.hour));
  }

  // Method untuk clear logs
  clearLogs(): void {
    this._logs = [];
  }
}

// ============================================
// CLASS Predictor - Prediksi produktivitas
// ============================================
export class Predictor {
  private _historicalData: number[] = [];
  private _coefficients: { a: number; b: number } = { a: 0, b: 0 };

  constructor() {
    this._coefficients = { a: 1.2, b: 5 }; // Default coefficients
  }

  // Method untuk menambah data historis
  addDataPoint(value: number): void {
    this._historicalData.push(value);
  }

  // Method untuk melatih model (simple linear regression)
  train(): void {
    if (this._historicalData.length < 2) return;

    const n = this._historicalData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    this._historicalData.forEach((y, x) => {
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator !== 0) {
      this._coefficients.a = (n * sumXY - sumX * sumY) / denominator;
      this._coefficients.b = (sumY - this._coefficients.a * sumX) / n;
    }
  }

  // Method untuk prediksi
  predict(timeStep: number): number {
    const prediction = this._coefficients.a * timeStep + this._coefficients.b;
    return Math.max(0, Math.round(prediction));
  }

  // Method untuk mendapatkan prediksi beberapa langkah ke depan
  getPredictions(steps: number): PredictionData[] {
    const currentHour = new Date().getHours();
    const predictions: PredictionData[] = [];

    for (let i = 0; i < steps; i++) {
      const hour = ((currentHour + i) % 24).toString().padStart(2, '0') + ':00';
      const actualValue = i < this._historicalData.length ? this._historicalData[i] : null;
      
      predictions.push({
        hour,
        actual: actualValue,
        predicted: this.predict(this._historicalData.length + i),
      });
    }

    return predictions;
  }

  // Method untuk mendapatkan akurasi model
  getAccuracy(): number {
    if (this._historicalData.length < 2) return 0;

    let totalError = 0;
    this._historicalData.forEach((actual, i) => {
      const predicted = this.predict(i);
      totalError += Math.abs(actual - predicted);
    });

    const avgError = totalError / this._historicalData.length;
    const avgActual = this._historicalData.reduce((a, b) => a + b, 0) / this._historicalData.length;
    
    return Math.max(0, Math.min(100, 100 - (avgError / avgActual) * 100));
  }
}
