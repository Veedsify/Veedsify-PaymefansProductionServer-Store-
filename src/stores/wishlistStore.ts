import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WishlistItem, StoreProduct } from "@/types";
import { wishlistApi } from "@/lib/api/wishlist";

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  isSyncing: boolean;
  addToWishlist: (product: StoreProduct) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  getWishlistCount: () => number;
  setWishlist: (products: StoreProduct[]) => void;
  syncWithBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  setItems: (items: WishlistItem[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,

      addToWishlist: async (product) => {
        // Check if product already exists in wishlist
        const exists = get().items.some(
          (item) => item.product.id === product.id,
        );

        if (exists) {
          return;
        }

        // Add to backend first, then update local state with backend response
        try {
          const result = await wishlistApi.addToWishlist(product.id);

          if (!result.error && result.data) {
            // Use backend data to ensure consistency
            set((state) => ({
              items: [...state.items, result.data],
            }));
          } else {
            // Fallback to optimistic update if backend returns no data
            const newItem: WishlistItem = {
              id: Date.now(),
              product,
            };
            set((state) => ({
              items: [...state.items, newItem],
            }));
          }
        } catch (error) {
          console.error("Failed to add to wishlist on backend:", error);
          // Still add locally as fallback
          const newItem: WishlistItem = {
            id: Date.now(),
            product,
          };
          set((state) => ({
            items: [...state.items, newItem],
          }));
        }
      },

      removeFromWishlist: async (productId) => {
        // First update local state
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));

        // Then sync with backend
        try {
          await wishlistApi.removeFromWishlist(productId);
        } catch (error) {
          console.error("Failed to remove from wishlist on backend:", error);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      clearWishlist: async () => {
        // First update local state
        set({ items: [] });

        // Then sync with backend
        try {
          await wishlistApi.clearWishlist();
        } catch (error) {
          console.error("Failed to clear wishlist on backend:", error);
        }
      },

      getWishlistCount: () => {
        return get().items.length;
      },

      setWishlist: (products) => {
        const wishlistItems: WishlistItem[] = products.map((product) => ({
          id: product.id,
          product,
        }));
        set({ items: wishlistItems });
      },

      syncWithBackend: async () => {
        if (get().isSyncing) return;

        set({ isSyncing: true });
        try {
          const items = get().items;
          const productIds = items.map((item) => item.product.id);
          const result = await wishlistApi.syncWishlist(productIds);
          if (!result.error && result.data && Array.isArray(result.data)) {
            set({ items: result.data });
          } else {
            console.error("Sync failed or returned invalid data:", result);
          }
        } catch (error) {
          console.error("Failed to sync wishlist:", error);
        } finally {
          set({ isSyncing: false });
        }
      },

      loadFromBackend: async () => {
        set({ isLoading: true });
        try {
          const result = await wishlistApi.getWishlist();
          if (!result.error && result.data && Array.isArray(result.data)) {
            set({ items: result.data });
          } else {
            // Set empty array if backend returns nothing
            if (!result.error) {
              set({ items: [] });
            }
          }
        } catch (error) {
          console.error("Failed to load wishlist from backend:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      setItems: (items) => {
        set({ items });
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
