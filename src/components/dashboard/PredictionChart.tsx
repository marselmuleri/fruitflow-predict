import { PredictionData } from '@/types/fruit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface PredictionChartProps {
  data: PredictionData[];
  accuracy: number;
}

export function PredictionChart({ data, accuracy }: PredictionChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Prediksi Produktivitas</h3>
          <p className="text-sm text-muted-foreground">Prediksi jumlah buah matang per jam (Regresi Linear)</p>
        </div>
        <div className="rounded-lg bg-primary/10 px-3 py-1.5 border border-primary/20">
          <span className="text-xs text-muted-foreground">Akurasi Model</span>
          <p className="text-lg font-bold text-primary">{accuracy.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 22%)" />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(220, 10%, 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(220, 10%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 18%, 13%)',
                border: '1px solid hsl(220, 15%, 22%)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: 'hsl(40, 20%, 95%)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: 'hsl(220, 10%, 55%)' }}>{value}</span>}
            />
            <ReferenceLine 
              y={60} 
              stroke="hsl(145, 60%, 45%)" 
              strokeDasharray="5 5" 
              label={{ value: 'Target', fill: 'hsl(145, 60%, 45%)', fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Aktual"
              stroke="hsl(28, 95%, 55%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(28, 95%, 55%)', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, fill: 'hsl(28, 95%, 55%)' }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Prediksi"
              stroke="hsl(220, 70%, 60%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(220, 70%, 60%)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">Prediksi 1 Jam</p>
          <p className="text-xl font-bold text-primary">{data[data.length - 1]?.predicted || 0}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">Trend</p>
          <p className="text-xl font-bold text-fruit-unripe">↑ Naik</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">Estimasi Harian</p>
          <p className="text-xl font-bold text-foreground">~1,500</p>
        </div>
      </div>
    </div>
  );
}
