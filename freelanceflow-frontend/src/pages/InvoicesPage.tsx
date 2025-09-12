import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useInvoiceStore, { type Invoice } from "@/store/invoiceStore";
import useClientStore from "@/store/clientStore";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoices/InvoicePDF";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import SendInvoiceDialog from "@/components/invoices/SendInvoiceDialog";

const InvoicesPage = () => {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoiceStore();
  const { clients } = useClientStore();
  const [isSendInvoiceDialogOpen, setIsSendInvoiceDialogOpen] = useState(false);
  const [invoiceToSend, setInvoiceToSend] = useState<Invoice | null>(null);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const formatCurrency = (amount: number) => {
    // Assuming 1 hour = $100 for display purposes
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount * 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US").format(date);
  };

  const handleStatusChange = (invoiceId: string, status: Invoice['status']) => {
    updateInvoiceStatus(invoiceId, status);
  };

  const handleOpenSendInvoiceDialog = (invoice: Invoice) => {
    setInvoiceToSend(invoice);
    setIsSendInvoiceDialogOpen(true);
  };

  const handleSendInvoice = (recipientEmail: string, subject: string, message: string) => {
    if (invoiceToSend) {
      console.log(`Simulating sending invoice ${invoiceToSend.id} to ${recipientEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      // In a real application, you would make an API call to your backend here
      // to send the invoice via email.
      updateInvoiceStatus(invoiceToSend.id, 'sent'); // Update status to sent
      setIsSendInvoiceDialogOpen(false);
      setInvoiceToSend(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{getClientName(invoice.clientId)}</TableCell>
                <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">...</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleOpenSendInvoiceDialog(invoice)}>
                        Send Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'sent')}>
                        Mark as Sent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'paid')}>
                        Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <PDFDownloadLink
                          document={<InvoicePDF invoice={invoice} />}
                          fileName={`invoice-${invoice.id}.pdf`}
                          className="w-full h-full px-2 py-1.5 text-sm"
                        >
                          {({ loading }) => (loading ? 'Loading...' : 'Download PDF')}
                        </PDFDownloadLink>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <span className="w-full text-left">Delete</span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the invoice.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteInvoice(invoice.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

    {invoiceToSend && (
      <SendInvoiceDialog
        invoice={invoiceToSend}
        isOpen={!!invoiceToSend}
        onClose={() => setIsSendInvoiceDialogOpen(false)}
        onSend={handleSendInvoice}
      />
    )}
  );
};

export default InvoicesPage;
