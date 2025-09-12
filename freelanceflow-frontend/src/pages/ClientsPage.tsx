import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import useClientStore, { Client } from "@/store/clientStore";
import ClientForm from "@/components/clients/ClientForm";
import GenerateInvoiceDialog from "@/components/invoices/GenerateInvoiceDialog";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

const ClientsPage = () => {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [invoicingClient, setInvoicingClient] = useState<Client | null>(null);

  const handleOpenFormDialog = (client: Client | null) => {
    setEditingClient(client);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setEditingClient(null);
    setIsFormDialogOpen(false);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingClient) {
      updateClient({ ...editingClient, ...values });
    } else {
      addClient(values);
    }
    handleCloseFormDialog();
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => handleOpenFormDialog(null)}>Create Client</Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Create a new client"}</DialogTitle>
          </DialogHeader>
          <ClientForm onSubmit={handleSubmit} initialData={editingClient || undefined} />
        </DialogContent>
      </Dialog>

      {invoicingClient && (
        <GenerateInvoiceDialog
          client={invoicingClient}
          isOpen={!!invoicingClient}
          onClose={() => setInvoicingClient(null)}
        />
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => setInvoicingClient(client)}>
                    Generate Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenFormDialog(client)}>Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the client and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsPage;
