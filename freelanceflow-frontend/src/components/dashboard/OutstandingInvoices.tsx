import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useInvoiceStore from '@/store/invoiceStore';
import useClientStore from '@/store/clientStore';
import { formatDistanceToNow } from 'date-fns';

const OutstandingInvoices = () => {
  const { invoices } = useInvoiceStore();
  const { clients } = useClientStore();

  const unpaidInvoices = React.useMemo(() => {
    return invoices
      .filter(invoice => !invoice.paid)
      .sort((a, b) => {
        // Sort by due date
        const aDate = new Date(a.dueDate);
        const bDate = new Date(b.dueDate);
        return aDate.getTime() - bDate.getTime();
      })
      .slice(0, 5)
      .map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        return {
          ...invoice,
          clientName: client?.name || 'Unknown Client',
          overdue: new Date(invoice.dueDate) < new Date(),
        };
      });
  }, [invoices, clients]);

  const totalOutstanding = unpaidInvoices.reduce(
    (sum, invoice) => sum + invoice.totalAmount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Outstanding Invoices
          </div>
          <div className="text-lg">
            ${totalOutstanding.toFixed(2)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unpaidInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{invoice.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  Due {formatDistanceToNow(new Date(invoice.dueDate), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  ${invoice.totalAmount.toFixed(2)}
                </div>
                {invoice.overdue && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutstandingInvoices;
