import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

/**
 * Custom hook to sync cart and wishlist stores with backend
 * Should be called once in the app layout or root component
 */
export function useStoreSync() {
  const { data: session, status } = useSession();
  const loadCart = useCartStore((state) => state.loadFromBackend);
  const loadWishlist = useWishlistStore((state) => state.loadFromBackend);
  const syncCart = useCartStore((state) => state.syncWithBackend);
  const syncWishlist = useWishlistStore((state) => state.syncWithBackend);

  useEffect(() => {
    // Only sync when user is authenticated
    if (status === "authenticated" && session?.user) {
      // Load data from backend on initial mount
      loadCart();
      loadWishlist();
    }
  }, [status, session, loadCart, loadWishlist]);

  // Sync local changes with backend when user logs in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Sync any local changes that were made while offline
      syncCart();
      syncWishlist();
    }
  }, [status, session, syncCart, syncWishlist]);

  // Optionally sync on window focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (status === "authenticated" && session?.user) {
        loadCart();
        loadWishlist();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [status, session, loadCart, loadWishlist]);

  // Sync before window unload (when user closes tab/window)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (status === "authenticated" && session?.user) {
        // Note: This uses sendBeacon for reliability during page unload
        // But since we're using async operations, we'll just trigger sync
        syncCart();
        syncWishlist();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status, session, syncCart, syncWishlist]);
}

/**
 * Hook to get sync status for both stores
 */
export function useSyncStatus() {
  const isCartLoading = useCartStore((state) => state.isLoading);
  const isCartSyncing = useCartStore((state) => state.isSyncing);
  const isWishlistLoading = useWishlistStore((state) => state.isLoading);
  const isWishlistSyncing = useWishlistStore((state) => state.isSyncing);

  return {
    isLoading: isCartLoading || isWishlistLoading,
    isSyncing: isCartSyncing || isWishlistSyncing,
    cart: {
      isLoading: isCartLoading,
      isSyncing: isCartSyncing,
    },
    wishlist: {
      isLoading: isWishlistLoading,
      isSyncing: isWishlistSyncing,
    },
  };
}
