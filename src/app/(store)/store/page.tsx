"use client";
import { ArrowRight, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import type { StoreProduct } from "@/types";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStoreProducts();

  // Flatten all pages of products and group by category
  const categorizedProducts = useMemo(() => {
    if (!data?.pages) return {};

    const allProducts = data.pages.flatMap((page) => page.data || []);

    return allProducts.reduce((acc, product) => {
      const category = product.category.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, StoreProduct[]>);
  }, [data]);

  const categories = Object.keys(categorizedProducts);

  if (isError) {
    return (
      <div className="min-h-dvh bg-white dark:bg-gray-950">
        <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-96">
            <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Failed to load products
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {(error as any)?.response?.data?.message ||
                "Something went wrong. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950">
      <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold dark:text-white">
            HI {session?.user?.name}
          </h2>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Shop by Category
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-200">
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

                  <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                    {displayProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-3 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Load More Products"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
