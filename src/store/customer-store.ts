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
  customerType: 'individual',
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
    customerType: incoming.customerType ?? existing?.customerType,
    defaultAddress: incoming.defaultAddress ?? existing?.defaultAddress,
    companyName: incoming.companyName ?? existing?.companyName,
    companyRegistrationNumber: incoming.companyRegistrationNumber ?? existing?.companyRegistrationNumber,
    businessSector: incoming.businessSector ?? existing?.businessSector,
    employeeCount: incoming.employeeCount ?? existing?.employeeCount,
    jobTitle: incoming.jobTitle ?? existing?.jobTitle,
    companyEmail: incoming.companyEmail ?? existing?.companyEmail,
    companyPhone: incoming.companyPhone ?? existing?.companyPhone,
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

const normalizeCustomerRecord = (customer: CustomerRecord): CustomerRecord => ({
  ...customer,
  customerType: customer.customerType ?? 'individual',
  createdAt: customer.createdAt || customer.lastActive || new Date().toISOString(),
  updatedAt: customer.updatedAt || customer.lastActive || new Date().toISOString(),
});

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
          customerType: user.customerType,
          defaultAddress: user.defaultAddress,
          companyName: user.companyName,
          companyRegistrationNumber: user.companyRegistrationNumber,
          businessSector: user.businessSector,
          employeeCount: user.employeeCount,
          jobTitle: user.jobTitle,
          companyEmail: user.companyEmail,
          companyPhone: user.companyPhone,
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
    {
      name: 'frogward-customers',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as CustomerStore | undefined;
        if (!state?.customers) return persistedState;

        return {
          ...state,
          customers: state.customers.map((customer) => normalizeCustomerRecord(customer)),
        };
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as Partial<CustomerStore> | undefined;
        const persistedCustomers = state?.customers?.map((customer) =>
          normalizeCustomerRecord(customer as CustomerRecord)
        );

        return {
          ...currentState,
          ...state,
          customers: persistedCustomers ?? currentState.customers,
        };
      },
    }
  )
);
