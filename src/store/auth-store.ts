import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from '@/store/cart-store';
import { useCustomerStore } from '@/store/customer-store';
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

const mockFacebookCustomer: User = {
  id: 'cust-fb-001',
  name: 'Anu T.',
  phone: '+976 8811 2244',
  email: 'anu.facebook@example.com',
  facebookId: 'fb-mock-001',
  role: 'customer',
  defaultAddress: 'Ulaanbaatar, Sukhbaatar District, 8th Khoroo',
  isPhoneVerified: false,
  isEmailVerified: true,
  createdAt: '2026-01-10T09:00:00Z',
  updatedAt: '2026-03-05T11:15:00Z',
};

const createOtpCustomer = (phone: string): User => {
  const normalized = phone.replace(/[\s+\-()]/g, '');
  const suffix = normalized.slice(-4) || '0000';
  const now = new Date().toISOString();

  return {
    id: `cust-otp-${normalized || suffix}`,
    name: `Customer ${suffix}`,
    phone,
    role: 'customer',
    defaultAddress: 'Ulaanbaatar, Mongolia',
    isPhoneVerified: true,
    isEmailVerified: false,
    createdAt: now,
    updatedAt: now,
  };
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
        // Mock: Facebook login uses a distinct demo customer
        useCustomerStore.getState().syncFromUser(mockFacebookCustomer);
        set({ user: mockFacebookCustomer, isAuthenticated: true });
      },
      loginWithOtp: (phone: string) => {
        const normalized = phone.replace(/[\s+\-()]/g, '');
        if (normalized === '99112233' || normalized === '97699112233') {
          useCartStore.getState().clearCart();
          set({ user: mockAdmin, isAuthenticated: true });
        } else {
          const customer = createOtpCustomer(phone);
          useCustomerStore.getState().syncFromUser(customer);
          set({ user: customer, isAuthenticated: true });
        }
      },
      logout: () => {
        useCartStore.getState().clearCart();
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates, updatedAt: new Date().toISOString() } : null,
        }));
        const nextUser = useAuthStore.getState().user;
        if (nextUser?.role === 'customer') {
          useCustomerStore.getState().syncFromUser(nextUser);
        }
      },
    }),
    { name: 'frogward-auth' }
  )
);
