import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Type for checkout data
 */
type CheckoutData = {
    items: Array<{
        product_id: string;
        quantity: number;
        size_id?: number;
    }>;
    shipping_address: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        country: string;
    };
    payment_method: "paystack";
};

/**
 * Hook for processing checkout
 */
export const useCheckout = () => {
    return useMutation({
        mutationFn: async (data: CheckoutData) => {
            const response = await axios.post("/api/checkout", data);
            return response.data;
        },
    });
};

/**
 * Hook for verifying payment
 * @param {string} reference - Payment reference to verify
 */
export const useVerifyPayment = (reference: string) => {
    return useQuery({
        queryKey: ["verify-payment", reference],
        queryFn: async () => {
            const response = await axios.get(
                `/api/payment/verify/${reference}`,
            );
            return response.data;
        },
        enabled: !!reference,
        retry: 3,
        retryDelay: 1000,
    });
};

/**
 * Hook for fetching user orders
 */
export const useUserOrders = () => {
    return useQuery({
        queryKey: ["user-orders"],
        queryFn: async () => {
            const response = await axios.get("/api/orders");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook for fetching a specific order by ID
 * @param {string} order_id - The order ID to fetch
 */
export const useOrder = (order_id: string) => {
    return useQuery({
        queryKey: ["order", order_id],
        queryFn: async () => {
            const response = await axios.get(`/api/orders/${order_id}`);
            return response.data;
        },
        enabled: !!order_id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook for updating order status
 */
export const useUpdateOrderStatus = () => {
    return useMutation({
        mutationFn: async ({
            order_id,
            status,
        }: {
            order_id: string;
            status: string;
        }) => {
            const response = await axios.patch(`/api/orders/${order_id}`, {
                status,
            });
            return response.data;
        },
    });
};

/**
 * Hook for canceling an order
 */
export const useCancelOrder = () => {
    return useMutation({
        mutationFn: async (order_id: string) => {
            const response = await axios.delete(`/api/orders/${order_id}`);
            return response.data;
        },
    });
};
