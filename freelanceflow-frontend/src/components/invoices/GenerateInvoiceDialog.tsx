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
import { Checkbox } from '../ui/checkbox';
import { Label } from '@/components/ui/label';
import useProjectStore from '@/store/projectStore';
import useInvoiceStore from '@/store/invoiceStore';
import { type Client } from '@/store/clientStore';

interface GenerateInvoiceDialogProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

const GenerateInvoiceDialog = ({ client, isOpen, onClose }: GenerateInvoiceDialogProps) => {
  const { projects } = useProjectStore();
  const { invoices, createInvoice } = useInvoiceStore();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Filter for projects that belong to the client and are not already part of an invoice
  const clientProjects = projects.filter(p => p.clientId === client.id);
  const invoicedProjectIds = new Set(invoices.flatMap(inv => inv.projectIds));
  const availableProjects = clientProjects.filter(p => !invoicedProjectIds.has(p.id) && p.tasks.length > 0);

  const handleCreateInvoice = () => {
    if (selectedProjects.length > 0) {
      createInvoice(client.id, selectedProjects);
      setSelectedProjects([]);
      onClose();
    }
  };

  const handleCheckboxChange = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Invoice for {client.name}</DialogTitle>
          <DialogDescription>
            Select the projects to include in this invoice. Only projects with billable hours that are not already invoiced are shown.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {availableProjects.length > 0 ? (
            availableProjects.map(project => (
              <div key={project.id} className="flex items-center space-x-2">
                <Checkbox
                  id={project.id}
                  onCheckedChange={() => handleCheckboxChange(project.id)}
                />
                <Label htmlFor={project.id} className="flex-grow">{project.name}</Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No billable projects available for this client.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateInvoice} disabled={selectedProjects.length === 0}>
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
