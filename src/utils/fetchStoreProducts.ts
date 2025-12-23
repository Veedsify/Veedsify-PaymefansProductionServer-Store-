import type { StoreAllProductsResponse } from "@/types";
import axios from "axios";

export const fetchStoreProducts = async (
  page: number = 1,
): Promise<StoreAllProductsResponse> => {
  const response = await axios.get("/api/store/products?page=" + page);
  return response.data;
};

export const fetchProduct = async (product_id: string): Promise<any> => {
  const response = await axios.get(`/api/store/products/${product_id}`);
  return response.data;
};

export default fetchStoreProducts;
