import type { CartItem } from "@/types";

export interface CartApiResponse {
    error: boolean;
    message: string;
    data?: any;
}

export const cartApi = {
    // Get user's cart from backend
    async getCart(): Promise<CartApiResponse> {
        try {
            const response = await fetch("/api/cart", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return await response.json();
        } catch (error) {
            console.error("Error fetching cart:", error);
            return {
                error: true,
                message: "Failed to fetch cart",
            };
        }
    },

    // Add item to cart
    async addToCart(
        productId: number,
        quantity: number,
        sizeId: number
    ): Promise<CartApiResponse> {
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    sizeId,
                }),
            });

            return await response.json();
        } catch (error) {
            console.error("Error adding to cart:", error);
            return {
                error: true,
                message: "Failed to add item to cart",
            };
        }
    },

    // Update cart item quantity
    async updateCartItem(
        itemId: number,
        quantity: number
    ): Promise<CartApiResponse> {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity }),
            });

            return await response.json();
        } catch (error) {
            console.error("Error updating cart item:", error);
            return {
                error: true,
                message: "Failed to update cart item",
            };
        }
    },

    // Remove item from cart
    async removeFromCart(itemId: number): Promise<CartApiResponse> {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return await response.json();
        } catch (error) {
            console.error("Error removing from cart:", error);
            return {
                error: true,
                message: "Failed to remove item from cart",
            };
        }
    },

    // Clear entire cart
    async clearCart(): Promise<CartApiResponse> {
        try {
            const response = await fetch("/api/cart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return await response.json();
        } catch (error) {
            console.error("Error clearing cart:", error);
            return {
                error: true,
                message: "Failed to clear cart",
            };
        }
    },

    // Sync local cart with backend
    async syncCart(cartItems: CartItem[]): Promise<CartApiResponse> {
        try {
            const response = await fetch("/api/cart/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cartItems }),
            });

            return await response.json();
        } catch (error) {
            console.error("Error syncing cart:", error);
            return {
                error: true,
                message: "Failed to sync cart",
            };
        }
    },
};
