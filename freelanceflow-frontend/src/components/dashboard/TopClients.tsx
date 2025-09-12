import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import useInvoiceStore from '@/store/invoiceStore';
import useClientStore from '@/store/clientStore';

interface ClientRevenue {
  clientId: string;
  clientName: string;
  totalRevenue: number;
  projectCount: number;
  invoiceCount: number;
}

interface TopClientsProps {
  className?: string;
}

const TopClients = ({ className }: TopClientsProps) => {
  const { invoices } = useInvoiceStore();
  const { clients } = useClientStore();

  const clientStats = React.useMemo(() => {
    const stats = new Map<string, ClientRevenue>();

    clients.forEach(client => {
      stats.set(client.id, {
        clientId: client.id,
        clientName: client.name,
        totalRevenue: 0,
        projectCount: 0,
        invoiceCount: 0
      });
    });

    invoices.forEach(invoice => {
      const stat = stats.get(invoice.clientId);
      if (stat) {
        stat.totalRevenue += invoice.totalAmount;
        stat.invoiceCount += 1;
      }
    });

    return Array.from(stats.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }, [invoices, clients]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top Clients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientStats.map(client => (
            <div
              key={client.clientId}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{client.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  {client.invoiceCount} invoices
                </p>
              </div>
              <div className="text-sm font-medium">
                ${client.totalRevenue.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopClients;
