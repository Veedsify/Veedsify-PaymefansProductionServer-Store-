"use client";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  // Subscribe to cart state for reactivity
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // Calculate totals reactively
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Shopping Cart
          </h1>
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag
              size={64}
              className="text-gray-400 dark:text-gray-600 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start shopping to add items to your cart
            </p>
            <Link
              href="/store"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
            >
              Continue Shopping
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
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-semibold flex items-center gap-2"
          >
            <Trash2 size={20} />
            Clear Cart
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg"
                >
                  <Link href={`/product/${item.product.product_id}`}>
                    <Image
                      src={
                        item.product.images[0]?.image_url || "/placeholder.png"
                      }
                      alt={item.product.name}
                      width={120}
                      height={160}
                      className="w-24 h-32 object-cover rounded"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link href={`/product/${item.product.product_id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-pink-600 mb-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {item.product.category.name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                      ₦ {numeral(item.product.price).format("0,0.00")}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:text-white"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.instock}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:text-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₦{" "}
                      {numeral(item.product.price * item.quantity).format(
                        "0,0.00"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}
                    )
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦ {numeral(subtotal).format("0,0.00")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                      ₦ {numeral(subtotal).format("0,0.00")}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/store"
                className="block w-full text-center px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:border-pink-600 dark:hover:border-pink-400 transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
