"use client";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import type { StoreProduct } from "@/types";

interface ProductCardProps {
    product: StoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart, syncWithBackend: syncCartWithBackend } = useCartStore();
    const {
        addToWishlist,
        isInWishlist,
        removeFromWishlist,
        syncWithBackend: syncWishlistWithBackend,
    } = useWishlistStore();
    const [showSuccess, setShowSuccess] = useState(false);
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // If product has sizes, redirect to product page
        if (product.sizes.length > 0) {
            window.location.href = `/product/${product.product_id}`;
            return;
        }

        addToCart(product, 1);
        syncCartWithBackend();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
      <div className="relative block overflow-hidden bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:shadow-md group">
        <Link href={`/product/${product.product_id}`}>
          <div className="relative aspect-3/4 bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <Image
              src={product.images[0]?.image_url || "/placeholder.png"}
              alt={product.name}
              width={640}
              height={853}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900"
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={inWishlist ? "currentColor" : "none"}
              />
            </button>

            {/* Stock Badge */}
            {product.instock === 0 && (
              <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                Out of Stock
              </div>
            )}
            {product.instock > 0 && product.instock < 10 && (
              <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                Only {product.instock} left
              </div>
            )}
          </div>
        </Link>

        <div className="p-3 sm:p-4">
          <Link href={`/product/${product.product_id}`}>
            <p className="mb-2">
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {product.name}
              </span>
            </p>
          </Link>

          <div className="flex flex-col justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-pink-600 dark:text-pink-400">
              ₦ {numeral(product.price).format("0,0.00")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {product.category.name}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.instock === 0}
            className="flex items-center justify-center w-full gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-colors rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {product.sizes.length > 0 ? "Select Options" : "Add to Cart"}
          </button>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-2 text-xs text-center text-green-600 dark:text-green-400">
              Added to cart!
            </div>
          )}
        </div>
      </div>
    );
}
