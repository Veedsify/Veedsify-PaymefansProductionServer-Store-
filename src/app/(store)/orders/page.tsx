"use client";
import {
  Package,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import { useState } from "react";
import { useUserOrders } from "@/hooks/useCheckout";
import { useOrderStore } from "@/stores/orderStore";
import { OrderItem } from "@/types";

export default function OrdersPage() {
  const { data, isLoading, isError, error } = useUserOrders();
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const orders = data?.data || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Orders
          </h1>
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-16 h-16 text-pink-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading your orders...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Orders
          </h1>
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load orders
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {(error as any)?.response?.data?.message ||
                "Something went wrong. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Orders
          </h1>
          <div className="flex flex-col items-center justify-center py-16">
            <Package
              size={64}
              className="text-gray-400 dark:text-gray-600 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start shopping to create your first order
            </p>
            <Link
              href="/store"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white dark:bg-gray-950 min-h-screen pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders ({orders.length})
          </h1>
          <Link
            href="/store"
            className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order: any) => {
            const isExpanded = expandedOrders.includes(order.id);

            return (
              <div
                key={order.id}
                className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Order #{order.order_id || order.orderId}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Placed on{" "}
                        {formatDate(order.created_at || order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp
                            size={20}
                            className="text-gray-900 dark:text-white"
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                            className="text-gray-900 dark:text-white"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                      ₦{" "}
                      {numeral(order.total_amount || order.total).format(
                        "0,0.00"
                      )}
                    </p>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="border-t border-gray-300 dark:border-slate-700 p-6">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item: OrderItem) => (
                          <div key={item.id} className="flex gap-4">
                            <Link href={`/product/${item.product.product_id}`}>
                              <Image
                                src={
                                  item.product.images[0]?.image_url ||
                                  "/placeholder.png"
                                }
                                alt={item.product.name}
                                width={80}
                                height={106}
                                className="w-20 h-24 object-cover rounded"
                              />
                            </Link>
                            <div className="flex-1">
                              <Link
                                href={`/product/${item.product.product_id}`}
                              >
                                <h5 className="font-semibold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400">
                                  {item.product.name}
                                </h5>
                              </Link>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Quantity: {item.quantity}
                                {item.size?.name &&
                                  ` | Size: ${item.size.name}`}
                              </p>
                              <p className="text-sm font-semibold text-pink-600 dark:text-pink-400 mt-1">
                                ₦{" "}
                                {numeral(item.price * item.quantity).format(
                                  "0,0.00"
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {order.shipping_address?.name ||
                            order.shippingAddress?.fullName}
                        </p>
                        <p>
                          {order.shipping_address?.phone ||
                            order.shippingAddress?.phone}
                        </p>
                        <p>
                          {order.shipping_address?.address ||
                            order.shippingAddress?.address}
                        </p>
                        <p>
                          {order.shipping_address?.city ||
                            order.shippingAddress?.city}
                          ,{" "}
                          {order.shipping_address?.state ||
                            order.shippingAddress?.state}{" "}
                          {order.shipping_address?.country ||
                            order.shippingAddress?.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
