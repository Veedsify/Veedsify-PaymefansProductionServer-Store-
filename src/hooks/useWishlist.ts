import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import ROUTE from "@/constants/routes";
import { useWishlistStore } from "@/stores/wishlistStore";
import type { StoreProduct } from "@/types";

/**
 * Hook for adding a product to wishlist
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  return useMutation({
    mutationFn: async ({
      productId,
      product,
    }: {
      productId: string;
      product: StoreProduct;
    }) => {
      const response = await axios.post(ROUTE.WISHLIST_ADD, {
        productId,
        product,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      addToWishlist(variables.product);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-count"] });
      toast.success("Product added to wishlist");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to add to wishlist";
      toast.error(message);
    },
  });
};

/**
 * Hook for removing a product from wishlist
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );

  return useMutation({
    mutationFn: async (productId: number) => {
      const response = await axios.delete(
        ROUTE.WISHLIST_REMOVE(String(productId)),
      );
      return response.data;
    },
    onSuccess: (data, productId) => {
      removeFromWishlist(productId);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-count"] });
      toast.success("Product removed from wishlist");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to remove from wishlist";
      toast.error(message);
    },
  });
};

/**
 * Hook for fetching user's wishlist from server
 */
export const useWishlist = () => {
  const setWishlist = useWishlistStore((state) => state.items);

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await axios.get(ROUTE.WISHLIST_GET);
      const wishlistData = response.data.data || [];
      // The server data will be synced with the store
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for checking if a product is in wishlist
 */
export const useCheckWishlist = (productId: string) => {
  return useQuery({
    queryKey: ["wishlist-check", productId],
    queryFn: async () => {
      const response = await axios.get(ROUTE.WISHLIST_CHECK(productId));
      return response.data;
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting wishlist count
 */
export const useWishlistCount = () => {
  return useQuery({
    queryKey: ["wishlist-count"],
    queryFn: async () => {
      const response = await axios.get(ROUTE.WISHLIST_COUNT);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for clearing the entire wishlist
 */
export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete(ROUTE.WISHLIST_CLEAR);
      return response.data;
    },
    onSuccess: () => {
      clearWishlist();
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-count"] });
      toast.success("Wishlist cleared successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to clear wishlist";
      toast.error(message);
    },
  });
};

/**
 * Hook for toggling wishlist (add/remove based on current state)
 */
export const useToggleWishlist = () => {
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  return {
    toggleWishlist: (productId: number, product: StoreProduct) => {
      if (isInWishlist(productId)) {
        removeMutation.mutate(productId);
      } else {
        addMutation.mutate({ productId: String(productId), product });
      }
    },
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
};
