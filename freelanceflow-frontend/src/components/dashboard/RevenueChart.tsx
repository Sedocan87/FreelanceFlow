import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, isWithinInterval, startOfDay } from 'date-fns';
import useInvoiceStore from '@/store/invoiceStore';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Period = '7' | '30' | '90';

interface RevenueChartProps {
  className?: string;
}

const RevenueChart = ({ className }: RevenueChartProps) => {
  const { invoices } = useInvoiceStore();
  const [period, setPeriod] = useState<Period>('30');

  const data = useMemo(() => {
    const days = parseInt(period);
    const endDate = startOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, days - 1));
    const previousStartDate = startOfDay(subDays(startDate, days));

    const dateArray = Array.from({ length: days }, (_, i) => {
      const date = subDays(endDate, days - 1 - i);
      return {
        date: format(date, 'MMM dd'),
        revenue: 0,
        previousRevenue: 0,
      };
    });

    invoices.forEach((invoice) => {
      const invoiceDate = startOfDay(invoice.createdAt);
      const formattedDate = format(invoiceDate, 'MMM dd');
      const dayData = dateArray.find(d => d.date === formattedDate);

      if (isWithinInterval(invoiceDate, { start: startDate, end: endDate })) {
        if (dayData) {
          dayData.revenue += invoice.totalAmount;
        }
      } else if (isWithinInterval(invoiceDate, { start: previousStartDate, end: subDays(startDate, 1) })) {
        const daysFromStart = Math.floor((invoiceDate.getTime() - previousStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const currentPeriodIndex = daysFromStart;
        if (dateArray[currentPeriodIndex]) {
          dateArray[currentPeriodIndex].previousRevenue += invoice.totalAmount;
        }
      }
    });

    return dateArray;
  }, [invoices, period]);

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, day) => sum + day.revenue, 0);
  }, [data]);

  const totalPreviousRevenue = useMemo(() => {
    return data.reduce((sum, day) => sum + day.previousRevenue, 0);
  }, [data]);

  const revenueChange = totalPreviousRevenue !== 0
    ? ((totalRevenue - totalPreviousRevenue) / totalPreviousRevenue) * 100
    : 0;

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Revenue</CardTitle>
        <Select
          value={period}
          onValueChange={(value: Period) => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </p>
            <h2 className="text-3xl font-bold">${totalRevenue.toFixed(2)}</h2>
          </div>
          <div className={cn(
            "rounded-md px-2 py-1 text-sm",
            revenueChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {revenueChange > 0 ? "+" : ""}{revenueChange.toFixed(1)}%
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => value}
                interval={Math.floor(parseInt(period) / 7)}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(value) => `${value}`}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}`, 'Revenue']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="previousRevenue"
                name="Previous Period"
                stroke="hsl(var(--muted))"
                fill="hsl(var(--muted))"
                fillOpacity={0.3}
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Current Period"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
