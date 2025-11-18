import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, StoreProduct } from "@/types";
import { cartApi } from "@/lib/api/cart";

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    isSyncing: boolean;
    addToCart: (
        product: StoreProduct,
        quantity?: number,
        selectedSize?: string,
    ) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: () => number;
    getItemCount: () => number;
    getCartItems: () => CartItem[];
    isInCart: (productId: number, selectedSize?: string) => boolean;
    getCartItem: (
        productId: number,
        selectedSize?: string,
    ) => CartItem | undefined;
    syncWithBackend: () => Promise<void>;
    loadFromBackend: () => Promise<void>;
    setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            isSyncing: false,

            addToCart: async (product, quantity = 1, selectedSize) => {
                console.log("Adding to cart:", {
                    product: product.id,
                    quantity,
                    selectedSize,
                });

                // Add to backend first, then update local state with backend response
                try {
                    const sizeId = product.sizes.find(
                        (s) => s.size.name === selectedSize,
                    )?.size.id;

                    console.log("Found sizeId:", sizeId);
                    if (sizeId) {
                        const result = await cartApi.addToCart(
                            product.id,
                            quantity,
                            sizeId,
                        );
                        console.log("Backend add to cart result:", result);

                        if (!result.error && result.data) {
                            // Use backend data to ensure consistency
                            set((state) => {
                                const existingItemIndex = state.items.findIndex(
                                    (item) => item.id === result.data.id,
                                );

                                if (existingItemIndex > -1) {
                                    const updatedItems = [...state.items];
                                    updatedItems[existingItemIndex] =
                                        result.data;
                                    return { items: updatedItems };
                                } else {
                                    return {
                                        items: [...state.items, result.data],
                                    };
                                }
                            });
                        } else {
                            // Fallback to optimistic update if backend returns no data
                            set((state) => {
                                const existingItemIndex = state.items.findIndex(
                                    (item) =>
                                        item.product.id === product.id &&
                                        item.selectedSize === selectedSize,
                                );

                                if (existingItemIndex > -1) {
                                    const updatedItems = [...state.items];
                                    updatedItems[existingItemIndex].quantity +=
                                        quantity;
                                    return { items: updatedItems };
                                } else {
                                    const newItem: CartItem = {
                                        id: Date.now(),
                                        product,
                                        quantity,
                                        selectedSize,
                                    };
                                    return { items: [...state.items, newItem] };
                                }
                            });
                        }
                    } else {
                        console.error(
                            "No sizeId found for selected size:",
                            selectedSize,
                        );
                    }
                } catch (error) {
                    console.error("Failed to add to cart on backend:", error);
                    // Still add locally as fallback
                    set((state) => {
                        const existingItemIndex = state.items.findIndex(
                            (item) =>
                                item.product.id === product.id &&
                                item.selectedSize === selectedSize,
                        );

                        if (existingItemIndex > -1) {
                            const updatedItems = [...state.items];
                            updatedItems[existingItemIndex].quantity +=
                                quantity;
                            return { items: updatedItems };
                        } else {
                            const newItem: CartItem = {
                                id: Date.now(),
                                product,
                                quantity,
                                selectedSize,
                            };
                            return { items: [...state.items, newItem] };
                        }
                    });
                }
            },

            removeFromCart: async (itemId) => {
                // First update local state
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));

                // Then sync with backend
                try {
                    await cartApi.removeFromCart(itemId);
                } catch (error) {
                    console.error(
                        "Failed to remove from cart on backend:",
                        error,
                    );
                }
            },

            updateQuantity: async (itemId, quantity) => {
                if (quantity <= 0) {
                    await get().removeFromCart(itemId);
                    return;
                }

                // First update local state
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item,
                    ),
                }));

                // Then sync with backend
                try {
                    await cartApi.updateCartItem(itemId, quantity);
                } catch (error) {
                    console.error(
                        "Failed to update cart item on backend:",
                        error,
                    );
                }
            },

            clearCart: async () => {
                // First update local state
                set({ items: [] });

                // Then sync with backend
                try {
                    await cartApi.clearCart();
                } catch (error) {
                    console.error("Failed to clear cart on backend:", error);
                }
            },

            total: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0,
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
                        (selectedSize === undefined ||
                            item.selectedSize === selectedSize),
                );
            },

            getCartItem: (productId, selectedSize) => {
                return get().items.find(
                    (item) =>
                        item.product.id === productId &&
                        (selectedSize === undefined ||
                            item.selectedSize === selectedSize),
                );
            },

            syncWithBackend: async () => {
                if (get().isSyncing) return;

                set({ isSyncing: true });
                try {
                    const items = get().items;
                    console.log(
                        "Syncing cart with backend, local items:",
                        items.length,
                    );
                    // Transform items to include sizeId
                    const itemsWithSizeId = items.map((item) => ({
                        ...item,
                        sizeId: item.product.sizes.find(
                            (s) => s.size.name === item.selectedSize,
                        )?.size.id,
                    }));

                    const result = await cartApi.syncCart(itemsWithSizeId);
                    console.log("Cart sync result:", result);
                    if (
                        !result.error &&
                        result.data &&
                        Array.isArray(result.data)
                    ) {
                        console.log(
                            "Updated cart items after sync:",
                            result.data.length,
                        );
                        set({ items: result.data });
                    } else {
                        console.error(
                            "Sync failed or returned invalid data:",
                            result,
                        );
                    }
                } catch (error) {
                    console.error("Failed to sync cart:", error);
                } finally {
                    set({ isSyncing: false });
                }
            },

            loadFromBackend: async () => {
                set({ isLoading: true });
                try {
                    console.log("Loading cart from backend...");
                    const result = await cartApi.getCart();
                    console.log("Cart API result:", result);
                    if (
                        !result.error &&
                        result.data &&
                        Array.isArray(result.data)
                    ) {
                        console.log(
                            "Setting cart items:",
                            result.data.length,
                            "items",
                        );
                        set({ items: result.data });
                    } else {
                        console.log(
                            "Cart load result error or no data:",
                            result,
                        );
                        // Set empty array if backend returns nothing
                        if (!result.error) {
                            set({ items: [] });
                        }
                    }
                } catch (error) {
                    console.error("Failed to load cart from backend:", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            setItems: (items) => {
                set({ items });
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
