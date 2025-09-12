import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Client {
  id: string;
  name: string;
  email: string;
}

interface ClientState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
}

const useClientStore = create<ClientState>((set) => ({
  clients: [
    // Some initial dummy data
    { id: uuidv4(), name: 'John Doe', email: 'john.doe@example.com' },
    { id: uuidv4(), name: 'Jane Smith', email: 'jane.smith@example.com' },
  ],
  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, { ...client, id: uuidv4() }],
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
