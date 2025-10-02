import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface InteractionsChartProps {
  data: Array<{ created_at: string }>;
}

export const InteractionsChart = ({ data }: InteractionsChartProps) => {
  // Group data by day
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = data.filter(item => 
      format(new Date(item.created_at), 'yyyy-MM-dd') === dateStr
    ).length;
    
    return {
      date: format(date, 'dd/MM'),
      interactions: count,
    };
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Interações dos Últimos 7 Dias</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="interactions" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorInteractions)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
