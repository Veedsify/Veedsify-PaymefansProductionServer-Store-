import type { StoreProduct } from "@/types";

export interface WishlistApiResponse {
  error: boolean;
  message: string;
  data?: any;
}

export const wishlistApi = {
  // Get user's wishlist from backend
  async getWishlist(): Promise<WishlistApiResponse> {
    try {
      const response = await fetch("/api/wishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return {
        error: true,
        message: "Failed to fetch wishlist",
      };
    }
  },

  // Add item to wishlist
  async addToWishlist(productId: number): Promise<WishlistApiResponse> {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return {
        error: true,
        message: "Failed to add item to wishlist",
      };
    }
  },

  // Remove item from wishlist by product ID
  async removeFromWishlist(productId: number): Promise<WishlistApiResponse> {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return {
        error: true,
        message: "Failed to remove item from wishlist",
      };
    }
  },

  // Clear entire wishlist
  async clearWishlist(): Promise<WishlistApiResponse> {
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      return {
        error: true,
        message: "Failed to clear wishlist",
      };
    }
  },

  // Sync local wishlist with backend
  async syncWishlist(productIds: number[]): Promise<WishlistApiResponse> {
    try {
      const response = await fetch("/api/wishlist/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error syncing wishlist:", error);
      return {
        error: true,
        message: "Failed to sync wishlist",
      };
    }
  },

  // Check if product is in wishlist
  async isInWishlist(productId: number): Promise<WishlistApiResponse> {
    try {
      const response = await fetch(`/api/wishlist/check/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return {
        error: true,
        message: "Failed to check wishlist",
      };
    }
  },
};
