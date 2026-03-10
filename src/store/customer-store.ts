import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockCustomers } from '@/data/mock-orders';
import type { User } from '@/types/user';
import type { Order } from '@/types/order';
import type { CustomerRecord } from '@/types/customer';

const initialCustomers: CustomerRecord[] = mockCustomers.map((customer) => ({
  id: customer.id,
  name: customer.name,
  phone: customer.phone,
  email: customer.email,
  lastActive: customer.lastActive,
  createdAt: customer.lastActive,
  updatedAt: customer.lastActive,
}));

const mergeCustomer = (
  existing: CustomerRecord | undefined,
  incoming: Partial<CustomerRecord> & Pick<CustomerRecord, 'id' | 'name' | 'phone'>
) => {
  const now = new Date().toISOString();

  return {
    id: incoming.id,
    name: incoming.name,
    phone: incoming.phone,
    email: incoming.email ?? existing?.email,
    defaultAddress: incoming.defaultAddress ?? existing?.defaultAddress,
    companyName: incoming.companyName ?? existing?.companyName,
    deliveryNotes: incoming.deliveryNotes ?? existing?.deliveryNotes,
    lastActive: incoming.lastActive ?? existing?.lastActive ?? now,
    createdAt: existing?.createdAt ?? incoming.createdAt ?? now,
    updatedAt: incoming.updatedAt ?? now,
  } satisfies CustomerRecord;
};

interface CustomerStore {
  customers: CustomerRecord[];
  upsertCustomer: (customer: Partial<CustomerRecord> & Pick<CustomerRecord, 'id' | 'name' | 'phone'>) => void;
  syncFromUser: (user: User) => void;
  syncFromOrder: (order: Order) => void;
  touchCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: initialCustomers,
      upsertCustomer: (customer) =>
        set((state) => {
          const existing = state.customers.find((entry) => entry.id === customer.id);
          const next = mergeCustomer(existing, customer);

          if (existing) {
            return {
              customers: state.customers.map((entry) => (entry.id === customer.id ? next : entry)),
            };
          }

          return {
            customers: [next, ...state.customers],
          };
        }),
      syncFromUser: (user) => {
        get().upsertCustomer({
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          defaultAddress: user.defaultAddress,
          companyName: user.companyName,
          deliveryNotes: user.deliveryNotes,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastActive: user.updatedAt,
        });
      },
      syncFromOrder: (order) => {
        get().upsertCustomer({
          id: order.customerId,
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail,
          defaultAddress: order.deliveryAddress,
          lastActive: order.updatedAt,
          updatedAt: order.updatedAt,
          createdAt: order.createdAt,
        });
      },
      touchCustomer: (id) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, lastActive: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : customer
          ),
        })),
    }),
    { name: 'frogward-customers' }
  )
);
