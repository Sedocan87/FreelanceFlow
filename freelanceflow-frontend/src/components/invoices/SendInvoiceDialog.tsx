import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Invoice } from '@/store/invoiceStore';
import useClientStore from '@/store/clientStore';

interface SendInvoiceDialogProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipientEmail: string, subject: string, message: string) => void;
}

const SendInvoiceDialog = ({ invoice, isOpen, onClose, onSend }: SendInvoiceDialogProps) => {
  const { clients } = useClientStore();
  const client = clients.find(c => c.id === invoice.clientId);

  const [recipientEmail, setRecipientEmail] = useState(client?.email || '');
  const [subject, setSubject] = useState(`Invoice ${invoice.id} from ${client?.name || 'Your Company'}`);
  const [message, setMessage] = useState(`Dear ${client?.name || 'Client'},

Please find attached your invoice for services rendered.

Best regards,
Your Company`);

  const handleSend = () => {
    onSend(recipientEmail, subject, message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Invoice {invoice.id}</DialogTitle>
          <DialogDescription>
            Prepare and send this invoice to {client?.name || 'the client'}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipientEmail" className="text-right">Recipient Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend}>Send Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvoiceDialog;
