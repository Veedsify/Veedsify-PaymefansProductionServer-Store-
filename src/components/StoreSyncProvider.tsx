"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

/**
 * Client component that handles syncing cart and wishlist with backend
 * This should be included in the layout to ensure automatic sync on login
 */
export default function StoreSyncProvider() {
    const { data: session, status } = useSession();
    const loadCart = useCartStore((state) => state.loadFromBackend);
    const loadWishlist = useWishlistStore((state) => state.loadFromBackend);
    const syncCart = useCartStore((state) => state.syncWithBackend);
    const syncWishlist = useWishlistStore((state) => state.syncWithBackend);

    useEffect(() => {
        // Only load from backend when user is authenticated
        if (status === "authenticated" && session?.user) {
            loadCart();
            loadWishlist();
        }
    }, [status, session, loadCart, loadWishlist]);

    // Sync on window focus to ensure data is fresh
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

    // Sync before window unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (status === "authenticated" && session?.user) {
                // Trigger sync (best effort)
                syncCart();
                syncWishlist();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [status, session, syncCart, syncWishlist]);

    // This component doesn't render anything
    return null;
}
