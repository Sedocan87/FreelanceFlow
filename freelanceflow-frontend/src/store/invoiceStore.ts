import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import useProjectStore from './projectStore';

export interface Invoice {
  id: string;
  clientId: string;
  projectIds: string[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: Date;
  dueDate: Date;
  paid: boolean;
}

interface InvoiceState {
  invoices: Invoice[];
  createInvoice: (clientId: string, projectIds: string[]) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  deleteInvoice: (invoiceId: string) => void;
}

const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  createInvoice: (clientId, projectIds) => {
    const { projects } = useProjectStore.getState();
    const projectsToInvoice = projects.filter(p => projectIds.includes(p.id));

    const totalAmount = projectsToInvoice.reduce((total, project) => {
      const projectTotal = project.tasks.reduce((sum, task) => sum + task.hours, 0); // Assuming 1 hour = $1 for simplicity
      return total + projectTotal;
    }, 0);

    const newInvoice: Invoice = {
      id: uuidv4(),
      clientId,
      projectIds,
      totalAmount,
      status: 'draft',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paid: false
    };

    set({ invoices: [...get().invoices, newInvoice] });
  },
  updateInvoiceStatus: (invoiceId, status) => {
    set(state => ({
      invoices: state.invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, status } : inv
      ),
    }));
  },
  deleteInvoice: (invoiceId) => {
    set(state => ({
      invoices: state.invoices.filter(inv => inv.id !== invoiceId),
    }));
  },
}));

export default useInvoiceStore;
