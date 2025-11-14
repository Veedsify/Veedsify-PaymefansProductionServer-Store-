"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mock-data";
import type { StoreProduct } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    // Convert slug back to category name
    const name = categorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setCategoryName(name);

    // Filter products by category
    const filtered = mockProducts.filter(
      (product) => product.category.name.toLowerCase() === name.toLowerCase()
    );

    setProducts(filtered);
    setIsLoading(false);
  }, [categorySlug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950">
      <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {categoryName}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            found
          </p>
        </header>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              No products found in this category
            </p>
            <Link
              href="/"
              className="px-6 py-3 font-semibold text-white rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
