import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface ClientState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
}

const useClientStore = create<ClientState>((set) => ({
  clients: [
    // Some initial dummy data
    { id: uuidv4(), name: 'John Doe', email: 'john.doe@example.com', createdAt: new Date() },
    { id: uuidv4(), name: 'Jane Smith', email: 'jane.smith@example.com', createdAt: new Date() },
  ],
  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, { ...client, id: uuidv4(), createdAt: new Date() }],
    })),
  updateClient: (updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      ),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
}));

export default useClientStore;
