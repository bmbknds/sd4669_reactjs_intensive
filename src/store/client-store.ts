import { create } from 'zustand';
import { Client } from '../types';

interface ClientState {
  selectedClient: Client | null;
  clients: Client[];
  setSelectedClient: (client: Client | null) => void;
  setClients: (clients: Client[]) => void;
  clearSelectedClient: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  selectedClient: null,
  clients: [],

  setSelectedClient: (client) => set({ selectedClient: client }),

  setClients: (clients) => set({ clients }),

  clearSelectedClient: () => set({ selectedClient: null }),
}));
