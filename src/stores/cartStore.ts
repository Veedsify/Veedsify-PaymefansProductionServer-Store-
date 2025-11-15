import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, StoreProduct } from "@/types";

interface CartStore {
  items: CartItem[];
  addToCart: (
    product: StoreProduct,
    quantity?: number,
    selectedSize?: string
  ) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  getItemCount: () => number;
  getCartItems: () => CartItem[];
  isInCart: (productId: number, selectedSize?: string) => boolean;
  getCartItem: (
    productId: number,
    selectedSize?: string
  ) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1, selectedSize) => {
        set((state) => {
          // Check if product already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === selectedSize
          );

          if (existingItemIndex > -1) {
            // Update quantity if item exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            // Add new item
            const newItem: CartItem = {
              id: Date.now(),
              product,
              quantity,
              selectedSize,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      total: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.length || 0;
      },

      getCartItems: () => {
        return get().items;
      },

      isInCart: (productId, selectedSize) => {
        return get().items.some(
          (item) =>
            item.product.id === productId &&
            (selectedSize === undefined || item.selectedSize === selectedSize)
        );
      },

      getCartItem: (productId, selectedSize) => {
        return get().items.find(
          (item) =>
            item.product.id === productId &&
            (selectedSize === undefined || item.selectedSize === selectedSize)
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
