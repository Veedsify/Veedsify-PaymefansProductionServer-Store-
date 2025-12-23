import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order } from "@/types";

interface OrderStore {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  getOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      setOrders: (orders) => {
        set({ orders });
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      getOrders: () => {
        return get().orders;
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.orderId === orderId);
      },

      clearOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
