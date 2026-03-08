import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '@/types/order';
import { mockOrders } from '@/data/mock-orders';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: mockOrders,
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        })),
    }),
    { name: 'frogward-orders' }
  )
);
