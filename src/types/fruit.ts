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
// 1. ENCAPSULATION - Menyembunyikan data internal
// ============================================
// Class Buah sebagai BASE CLASS (Parent Class)
// ============================================
export class Buah {
  // Private properties - ENCAPSULATION
  // Data disembunyikan dari akses langsung luar class
  private _id: string;
  private _timestamp: Date;
  protected _category: FruitCategory; // Protected agar bisa diakses subclass
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

  // Getter methods - Akses terkontrol ke data private (ENCAPSULATION)
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

  // ============================================
  // 3. POLYMORPHISM - Method yang bisa di-override
  // ============================================
  // Method ini akan di-override oleh subclass
  getDescription(): string {
    return `Buah dengan ID ${this._id}`;
  }

  // Method polymorphic untuk aksi sortir
  getSortingAction(): string {
    return 'Menunggu klasifikasi...';
  }

  // Method polymorphic untuk prioritas
  getPriority(): number {
    return 0;
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
// 2. INHERITANCE - Pewarisan dari class Buah
// ============================================

// Subclass JerukMatang - Mewarisi semua dari Buah
export class JerukMatang extends Buah {
  private _sweetness: number; // Property tambahan khusus jeruk matang

  constructor(id: string, rgbValues: RGBValue, confidence: number = 0.95, sweetness: number = 8) {
    // Memanggil constructor parent class
    super(id, FruitCategory.RIPE, rgbValues, confidence);
    this._sweetness = sweetness;
  }

  // Getter untuk property tambahan
  get sweetness(): number {
    return this._sweetness;
  }

  // ============================================
  // 3. POLYMORPHISM - Override method dari parent
  // ============================================
  override getDescription(): string {
    return `🍊 Jeruk Matang (ID: ${this.id}) - Tingkat kemanisan: ${this._sweetness}/10`;
  }

  override getSortingAction(): string {
    return '✅ Kirim ke jalur PACKING - Siap dijual';
  }

  override getPriority(): number {
    return 1; // Prioritas tinggi untuk dijual
  }
}

// Subclass JerukMentah - Mewarisi semua dari Buah
export class JerukMentah extends Buah {
  private _daysToRipe: number; // Estimasi hari sampai matang

  constructor(id: string, rgbValues: RGBValue, confidence: number = 0.95, daysToRipe: number = 5) {
    super(id, FruitCategory.UNRIPE, rgbValues, confidence);
    this._daysToRipe = daysToRipe;
  }

  get daysToRipe(): number {
    return this._daysToRipe;
  }

  // POLYMORPHISM - Override dengan behavior berbeda
  override getDescription(): string {
    return `🟢 Jeruk Mentah (ID: ${this.id}) - Estimasi matang: ${this._daysToRipe} hari lagi`;
  }

  override getSortingAction(): string {
    return '📦 Kirim ke jalur PENYIMPANAN - Perlu pematangan';
  }

  override getPriority(): number {
    return 2; // Prioritas sedang
  }
}

// Subclass JerukRusak - Mewarisi semua dari Buah
export class JerukRusak extends Buah {
  private _damageType: string; // Jenis kerusakan

  constructor(id: string, rgbValues: RGBValue, confidence: number = 0.95, damageType: string = 'busuk') {
    super(id, FruitCategory.DAMAGED, rgbValues, confidence);
    this._damageType = damageType;
  }

  get damageType(): string {
    return this._damageType;
  }

  // POLYMORPHISM - Override dengan behavior berbeda
  override getDescription(): string {
    return `🔴 Jeruk Rusak (ID: ${this.id}) - Jenis kerusakan: ${this._damageType}`;
  }

  override getSortingAction(): string {
    return '🗑️ Kirim ke jalur LIMBAH - Tidak layak konsumsi';
  }

  override getPriority(): number {
    return 3; // Prioritas rendah
  }
}

// ============================================
// Factory Function - Membuat instance berdasarkan kategori
// ============================================
export function createBuah(
  id: string,
  category: FruitCategory,
  rgbValues: RGBValue,
  confidence: number = 0.95
): Buah {
  switch (category) {
    case FruitCategory.RIPE:
      return new JerukMatang(id, rgbValues, confidence);
    case FruitCategory.UNRIPE:
      return new JerukMentah(id, rgbValues, confidence);
    case FruitCategory.DAMAGED:
      return new JerukRusak(id, rgbValues, confidence);
    default:
      return new Buah(id, category, rgbValues, confidence);
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
    this._coefficients = { a: 1.2, b: 5 };
  }

  addDataPoint(value: number): void {
    this._historicalData.push(value);
  }

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

  predict(timeStep: number): number {
    const prediction = this._coefficients.a * timeStep + this._coefficients.b;
    return Math.max(0, Math.round(prediction));
  }

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
