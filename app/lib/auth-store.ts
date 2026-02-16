import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      setUser: (user) => set({ user, isInitialized: true }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        set({ user: null, error: null });
      },
      initialize: () => {
        set({ isInitialized: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
