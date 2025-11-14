"use client";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mock-data";
import type { StoreProduct } from "@/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [categorizedProducts, setCategorizedProducts] = useState<
    Record<string, StoreProduct[]>
  >({});

  useEffect(() => {
    // Group products by category
    const grouped = mockProducts.reduce((acc, product) => {
      const category = product.category.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, StoreProduct[]>);
    setCategorizedProducts(grouped);
    setIsLoading(false);
  }, []);

  const categories = Object.keys(categorizedProducts);

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950">
      <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl mb-2">
            Shop by Category
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">
            Discover exclusive products and merchandise from your favorite
            creators. Quality items across all categories.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center mt-4 font-medium text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors gap-1"
          >
            View My Orders <ArrowRight size={20} />
          </Link>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading products..." />
          </div>
        ) : (
          <div className="space-y-12 z-200">
            {categories.map((category) => {
              const products = categorizedProducts[category];
              const displayProducts = products.slice(0, 4); // Show first 4 products

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {category}
                    </h2>
                    {products.length > 4 && (
                      <Link
                        href={`/category/${category
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="flex items-center gap-1 text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                      >
                        View All ({products.length})
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {displayProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
