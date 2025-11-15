import axiosInstance from "./Axios";
import ROUTE from "@/constants/routes";
import type { StoreAllProductsResponse } from "@/types";

/**
 * Fetches store products from the API
 * @param {number} page - The page number to fetch
 * @returns {Promise<StoreAllProductsResponse>} The store products response
 */
export const fetchStoreProducts = async (
  page: number = 1
): Promise<StoreAllProductsResponse> => {
  const response = await axiosInstance.get(ROUTE.FETCH_STORE_PRODUCTS(page));
  return response.data;
};

/**
 * Fetches a single product by ID
 * @param {string} product_id - The product ID
 * @returns {Promise<any>} The product data
 */
export const fetchProduct = async (product_id: string): Promise<any> => {
  const response = await axiosInstance.get(ROUTE.FETCH_PRODUCT(product_id));
  return response.data;
};

export default fetchStoreProducts;
