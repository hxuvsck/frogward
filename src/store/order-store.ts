import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '@/types/order';
import { mockOrders } from '@/data/mock-orders';
import { sanitizeProductImage } from '@/lib/product-image';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const normalizeOrder = (order: Order): Order => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    image: sanitizeProductImage(item.image),
  })),
});

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: mockOrders.map(normalizeOrder),
      addOrder: (order) => set((s) => ({ orders: [normalizeOrder(order), ...s.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        })),
    }),
    {
      name: 'frogward-orders',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as OrderStore | undefined;
        if (!state?.orders) return persistedState;

        return {
          ...state,
          orders: state.orders.map(normalizeOrder),
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<OrderStore> | undefined;
        const current = currentState as OrderStore;

        return {
          ...current,
          ...persisted,
          orders: (persisted?.orders ?? current.orders).map(normalizeOrder),
        };
      },
    }
  )
);
