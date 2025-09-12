import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useProjectStore from "@/store/projectStore";
import useClientStore from "@/store/clientStore";
import useInvoiceStore from "@/store/invoiceStore";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subMonths, addMonths } from 'date-fns';
import { Button } from '@/components/ui/button';

const ReportsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { projects } = useProjectStore();
  const { clients } = useClientStore();
  const { invoices } = useInvoiceStore();

  // Calculate time tracking data
  const timeData = clients.map(client => {
    const clientProjects = projects.filter(p => p.clientId === client.id);
    const totalHours = clientProjects.reduce((sum, project) => 
      sum + project.tasks.reduce((taskSum, task) => taskSum + task.hours, 0), 0
    );
    return {
      name: client.name,
      hours: totalHours,
    };
  });

  // Calculate revenue data for the selected month
  const monthInterval = {
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  };

  const dailyRevenue = eachDayOfInterval(monthInterval).map(date => {
    const dayInvoices = invoices.filter(inv => 
      format(inv.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return {
      date: format(date, 'MMM dd'),
      revenue: dayInvoices.reduce((sum, inv) => sum + inv.totalAmount * 100, 0),
    };
  });

  // Calculate summary metrics
  const totalHours = timeData.reduce((sum, item) => sum + item.hours, 0);
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount * 100, 0);
  const averageHourlyRate = totalHours > 0 ? totalRevenue / totalHours : 0;

  return (
    <div className="space-y-6">
            <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
            Previous Month
          </Button>
          <span className="font-medium">{format(selectedMonth, 'MMMM yyyy')}</span>
          <Button variant="outline" onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
            Next Month
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageHourlyRate.toFixed(2)}/hr</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" interval={2} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
