import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loginWithFacebook: () => void;
  loginWithOtp: (phone: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const mockCustomer: User = {
  id: 'cust-001',
  name: 'Bat-Erdene D.',
  phone: '+976 9911 2233',
  email: 'bat@example.com',
  role: 'customer',
  defaultAddress: 'Ulaanbaatar, Khan-Uul District, 15th Khoroo',
  isPhoneVerified: true,
  isEmailVerified: false,
  createdAt: '2025-09-15T10:00:00Z',
  updatedAt: '2026-02-20T14:30:00Z',
};

const mockAdmin: User = {
  id: 'admin-001',
  name: 'Admin Frogward',
  phone: '99112233',
  email: 'admin@frogward.mn',
  role: 'admin',
  isPhoneVerified: true,
  isEmailVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginWithFacebook: () => {
        // Mock: always logs in as customer
        set({ user: mockCustomer, isAuthenticated: true });
      },
      loginWithOtp: (phone: string) => {
        const normalized = phone.replace(/[\s+\-()]/g, '');
        if (normalized === '99112233' || normalized === '97699112233') {
          set({ user: mockAdmin, isAuthenticated: true });
        } else {
          set({ user: { ...mockCustomer, phone }, isAuthenticated: true });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates, updatedAt: new Date().toISOString() } : null,
        }));
      },
    }),
    { name: 'frogward-auth' }
  )
);
