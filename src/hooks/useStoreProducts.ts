import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { StoreAllProductsResponse } from "@/types";
import { fetchStoreProducts, fetchProduct } from "@/utils/fetchStoreProducts";

/**
 * Hook for fetching store products with infinite scroll
 * @param {number} limit - Number of products per page
 * @returns Infinite query result
 */
export const useStoreProducts = (limit: number = 10) => {
  return useInfiniteQuery<StoreAllProductsResponse>({
    queryKey: ["store-products", limit],
    queryFn: ({ pageParam = 1 }) => fetchStoreProducts(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching a single product by ID
 * @param {string} product_id - The product ID
 * @returns Query result with product data
 */
export const useProduct = (product_id: string) => {
  return useQuery({
    queryKey: ["product", product_id],
    queryFn: () => fetchProduct(product_id),
    enabled: !!product_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
