import React from 'react';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import useInvoiceStore from '@/store/invoiceStore';
import useProjectStore from '@/store/projectStore';
import useClientStore from '@/store/clientStore';

interface ActivityItem {
  id: string;
  type: 'invoice' | 'project' | 'client';
  title: string;
  date: Date;
  amount?: number;
}

interface RecentActivityProps {
  className?: string;
}

const RecentActivity = ({ className }: RecentActivityProps) => {
  const { invoices } = useInvoiceStore();
  const { projects } = useProjectStore();
  const { clients } = useClientStore();

  const activities = React.useMemo(() => {
    const allActivities: ActivityItem[] = [
      ...invoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        return {
          id: invoice.id,
          type: 'invoice' as const,
          title: `Invoice created for ${client?.name || 'Unknown Client'}`,
          date: invoice.createdAt,
          amount: invoice.totalAmount
        }
      }),
      ...projects.map(project => ({
        id: project.id,
        type: 'project' as const,
        title: `New project: ${project.name}`,
        date: new Date(project.createdAt)
      })),
      ...clients.map(client => ({
        id: client.id,
        type: 'client' as const,
        title: `New client: ${client.name}`,
        date: new Date(client.createdAt)
      }))
    ];

    return allActivities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [invoices, projects, clients]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(activity.date, 'MMM d, yyyy')}
                </p>
              </div>
              {activity.amount && (
                <div className="text-sm font-medium">
                  ${activity.amount.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
