"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useCheckout } from "@/hooks/useCheckout";
import { useSession } from "next-auth/react";
import { NIGERIAN_STATES, calculateDeliveryFee } from "@/utils/nigerianStates";

type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const { data: session } = useSession();
  const subtotal = useCartStore((state) => state.total());
  const taxRate = 0.075;
  const tax = subtotal * taxRate;

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: session?.user?.name ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
  });

  // Calculate delivery fee based on selected state
  const deliveryFee = useMemo(() => {
    if (!shippingAddress.state) return 0;
    return calculateDeliveryFee(shippingAddress.state, subtotal);
  }, [shippingAddress.state, subtotal]);

  const cartTotal = subtotal + tax + deliveryFee;

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const checkoutMutation = useCheckout();

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!shippingAddress.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const checkoutItems = items.map((item) => ({
      product_id: item.product.product_id,
      quantity: item.quantity,
      size_id: item.selectedSize
        ? item.product.sizes.find((s) => s.size.name === item.selectedSize)
            ?.size.id
        : undefined,
    }));

    checkoutMutation.mutate(
      {
        items: checkoutItems,
        shipping_address: shippingAddress,
        payment_method: "paystack",
      },
      {
        onSuccess: (data: any) => {
          if (data.error) {
            toast.error(data.message || "Checkout failed");
            return;
          }

          toast.success("Order placed! Redirecting to payment...");

          // Store order info for post-payment handling
          if (data.data?.reference) {
            localStorage.setItem("pendingOrderReference", data.data.reference);
          }
          if (data.data?.order_id) {
            localStorage.setItem("pendingOrderId", data.data.order_id);
          }

          // DON'T clear cart here - only clear after successful payment verification
          // This prevents showing empty cart when users return before payment completes

          // Redirect to Paystack payment page
          if (data.data?.payment_url) {
            window.location.href = data.data.payment_url;
          } else {
            toast.error("Payment URL not received");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Checkout failed. Please try again.",
          );
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add items to your cart before checking out
            </p>
            <a
              href="/store"
              className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
            >
              Continue Shopping
            </a>
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
            Checkout
          </h1>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.address
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                          errors.city
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        State *
                      </label>
                      <select
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                          errors.state
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Country *
                    </label>
                    <select
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      disabled
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 cursor-not-allowed ${
                        errors.country
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value="Nigeria">Nigeria</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={checkoutMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  `Place Order - ₦${numeral(cartTotal).format("0,0.00")}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Image
                      src={
                        item.product.images[0]?.image_url || "/placeholder.png"
                      }
                      alt={item.product.name}
                      width={60}
                      height={80}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Qty: {item.quantity}
                        {item.selectedSize && ` | Size: ${item.selectedSize}`}
                      </p>
                      <p className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                        ₦{" "}
                        {numeral(item.product.price * item.quantity).format(
                          "0,0.00",
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-300 dark:border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦ {numeral(subtotal).format("0,0.00")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    VAT (7.5%)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦ {numeral(tax).format("0,0.00")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      `₦ ${numeral(deliveryFee).format("0,0.00")}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-300 dark:border-slate-700 pt-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                    ₦ {numeral(cartTotal).format("0,0.00")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
