import { HourlyData } from '@/types/fruit';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SortingChartProps {
  data: HourlyData[];
}

export function SortingChart({ data }: SortingChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Hasil Sortir Per Jam</h3>
        <p className="text-sm text-muted-foreground">Data real-time hasil deteksi dan penyortiran buah</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRipe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(28, 95%, 55%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(28, 95%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUnripe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 60%, 45%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(145, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDamaged" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="ripe"
              name="Matang"
              stroke="hsl(28, 95%, 55%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRipe)"
            />
            <Area
              type="monotone"
              dataKey="unripe"
              name="Mentah"
              stroke="hsl(145, 60%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUnripe)"
            />
            <Area
              type="monotone"
              dataKey="damaged"
              name="Rusak"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDamaged)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
