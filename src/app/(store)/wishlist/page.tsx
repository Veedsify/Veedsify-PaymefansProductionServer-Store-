"use client";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const handleAddToCart = (productId: number) => {
    const item = items.find((item) => item.product.id === productId);
    if (item) {
      addToCart(item.product, 1);
      setAddedToCart(productId);
      setTimeout(() => setAddedToCart(null), 2000);
    }
  };

  if (items.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Wishlist
          </h1>
          <div className="flex flex-col items-center justify-center py-16">
            <Heart
              size={64}
              className="text-gray-400 dark:text-gray-600 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Save items you love to your wishlist
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
            My Wishlist ({items.length})
          </h1>
          <button
            onClick={clearWishlist}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-semibold flex items-center gap-2"
          >
            <Trash2 size={20} />
            Clear Wishlist
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden group relative"
            >
              <Link href={`/product/${item.product.product_id}`}>
                <div className="relative aspect-3/4 overflow-hidden">
                  <Image
                    src={
                      item.product.images[0]?.image_url || "/placeholder.png"
                    }
                    alt={item.product.name}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/product/${item.product.product_id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-pink-600 mb-1 line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {item.product.category.name}
                </p>
                <p className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                  ₦ {numeral(item.product.price).format("0,0.00")}
                </p>

                {addedToCart === item.product.id ? (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded text-center text-sm font-semibold mb-2">
                    Added to Cart!
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors font-semibold mb-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                )}

                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/store"
            className="inline-block px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:border-pink-600 dark:hover:border-pink-400 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
