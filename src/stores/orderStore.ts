import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order } from "@/types";
import { mockOrders } from "@/data/mock-data";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

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
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
