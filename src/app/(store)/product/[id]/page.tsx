"use client";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import numeral from "numeral";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getProductById } from "@/data/mock-data";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import type { StoreProduct } from "@/types";

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addToCart } = useCartStore();
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlistStore();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct || null);
      if (foundProduct && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0].size.name);
      }
      setIsLoading(false);
    }, 300);
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.instock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Product not found
        </h1>
        <Link
          href="/"
          className="text-pink-600 dark:text-pink-400 hover:underline"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white min-h-dvh dark:bg-gray-950">
      {/* Main Container */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20 md:pb-0">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-3/4 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <Image
                width={640}
                height={853}
                unoptimized
                src={
                  product.images[selectedImageIndex]?.image_url ||
                  "/placeholder.png"
                }
                alt={`Product view ${selectedImageIndex + 1}`}
                className="object-cover w-full h-full"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        (selectedImageIndex - 1 + product.images.length) %
                          product.images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 dark:text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        (selectedImageIndex + 1) % product.images.length
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 dark:text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1 text-sm font-medium text-white bg-black/60 dark:bg-slate-800/80 backdrop-blur-sm rounded-full">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Preview */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden transition-all border ${
                      selectedImageIndex === index
                        ? "ring-2 ring-pink-600 scale-95 border-pink-600"
                        : "border-slate-300 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500"
                    }`}
                  >
                    <Image
                      width={200}
                      height={200}
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Title and Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {product.name}
              </h1>
              <button
                onClick={handleWishlistToggle}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-6 h-6 ${
                    inWishlist
                      ? "fill-pink-600 text-pink-600"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-pink-600">
                {numeral(product.price).format("$0,0.00")}
              </span>
              {product.price < product.price * 1.2 && (
                <span className="text-xl text-slate-500 dark:text-slate-400 line-through">
                  {numeral(product.price * 1.2).format("$0,0.00")}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.instock > 10 ? (
                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  In Stock ({product.instock} available)
                </span>
              ) : product.instock > 0 ? (
                <span className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                  Only {product.instock} left!
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Description
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Key Features
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-600 mt-2 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Premium quality materials for long-lasting durability
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-600 mt-2 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Expertly crafted with attention to detail
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-600 mt-2 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Versatile design suitable for any occasion
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-600 mt-2 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Easy care and maintenance
                  </span>
                </li>
              </ul>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Select Size
                </h2>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((sizeObj, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(sizeObj.size.name)}
                      className={`px-6 py-3 rounded font-medium transition-all border ${
                        selectedSize === sizeObj.size.name
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {sizeObj.size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Quantity
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="p-3 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 border border-slate-200 dark:border-slate-700"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5 dark:text-white" />
                </button>
                <span className="text-2xl font-bold text-slate-900 dark:text-white min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 border border-slate-200 dark:border-slate-700"
                  disabled={quantity >= product.instock}
                >
                  <Plus className="w-5 h-5 dark:text-white" />
                </button>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded font-medium">
                ✓ Product added to cart successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.instock === 0}
                className="flex-1 py-4 px-6 bg-pink-600 text-white rounded font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-pink-600"
              >
                <ShoppingCart className="w-5 h-5 inline-block mr-2" />
                Add to Cart
              </button>
              <button
                onClick={() => {
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description || "",
                      url: window.location.href,
                    });
                  }
                }}
                className="p-4 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <Truck className="w-6 h-6 text-pink-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Free Shipping
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  On orders over $50
                </p>
              </div>
              <div className="p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <RotateCcw className="w-6 h-6 text-pink-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  30-Day Returns
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Easy return policy
                </p>
              </div>
              <div className="p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <Shield className="w-6 h-6 text-pink-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Secure Payment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  100% secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
