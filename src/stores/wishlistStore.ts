import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WishlistItem, StoreProduct } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (product: StoreProduct) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        set((state) => {
          // Check if product already exists in wishlist
          const exists = state.items.some(
            (item) => item.product.id === product.id
          );

          if (exists) {
            return state;
          }

          const newItem: WishlistItem = {
            id: Date.now(),
            product,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
