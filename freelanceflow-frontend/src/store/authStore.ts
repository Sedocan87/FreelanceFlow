import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
  register: (email: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email) => set({ isAuthenticated: true, user: { email } }),
  logout: () => set({ isAuthenticated: false, user: null }),
  register: (email) => set({ isAuthenticated: true, user: { email } }),
}));

export default useAuthStore;
