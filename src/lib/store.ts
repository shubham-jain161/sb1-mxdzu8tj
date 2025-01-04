import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  tokens: number;
  setUser: (user: any) => void;
  setTokens: (tokens: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: 0,
  setUser: (user) => set({ user }),
  setTokens: (tokens) => set({ tokens }),
}));