"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoLogoTiktok } from "react-icons/io5";
import {
  X,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useStoreProducts } from "@/hooks/useStoreProducts";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const { data: productsData } = useStoreProducts(50);

  useEffect(() => {
    // Get unique categories from all fetched products
    if (productsData?.pages) {
      const allProducts = productsData.pages.flatMap((page) => page.data);
      const uniqueCategories = Array.from(
        new Set(allProducts.map((product) => product.category.name))
      );
      setCategories(uniqueCategories);
    }
  }, [productsData]);

  // Close sidebar when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
      <>
          {/* Backdrop */}
          {isOpen && (
              <div
                  className="fixed inset-0 bg-black/50 z-200 transition-opacity"
                  onClick={onClose}
              />
          )}

          {/* Sidebar */}
          <aside
              className={`fixed top-0 left-0 h-full w-80 z-350 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
              <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
                      <Link href="/store" onClick={onClose}>
                          <Image
                              src={"/logos/logo1.svg"}
                              alt="Logo"
                              width={150}
                              height={40}
                              className="h-10"
                          />
                      </Link>
                      <button
                          onClick={onClose}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Close sidebar"
                      >
                          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                      {/* Categories Section */}
                      <div className="mb-8">
                          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                              Shop by Category
                          </h2>
                          <nav className="space-y-2">
                              {categories.map((category) => (
                                  <Link
                                      key={category}
                                      href={`/category/${category
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                      onClick={onClose}
                                      className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
                                  >
                                      <span className="font-medium">
                                          {category}
                                      </span>
                                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                              ))}
                          </nav>
                      </div>

                      {/* Quick Links */}
                      <div className="mb-8">
                          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                              Quick Links
                          </h2>
                          <nav className="space-y-2">
                              <Link
                                  href="/wishlist"
                                  onClick={onClose}
                                  className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
                              >
                                  <span className="font-medium">
                                      My Wishlist
                                  </span>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              <Link
                                  href="/orders"
                                  onClick={onClose}
                                  className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
                              >
                                  <span className="font-medium">My Orders</span>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              <Link
                                  href="https://paymefans.com"
                                  onClick={onClose}
                                  className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
                              >
                                  <span className="font-medium">
                                      Back to Profile
                                  </span>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                          </nav>
                      </div>

                      {/* Social Media */}
                      <div>
                          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                              Follow Us
                          </h2>
                          <div className="flex items-center gap-3">
                              <a
                                  href="https://tiktok.com/@paymefansshop"
                                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 transition-colors"
                                  aria-label="Facebook"
                              >
                                  <IoLogoTiktok className="w-5 h-5" />
                              </a>
                              <a
                                  href="https://twitter.com/paymefansshop"
                                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 transition-colors"
                                  aria-label="Twitter"
                              >
                                  <Twitter className="w-5 h-5" />
                              </a>
                              <a
                                  href="https://instagram.com/paymefansshop"
                                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 transition-colors"
                                  aria-label="Instagram"
                              >
                                  <Instagram className="w-5 h-5" />
                              </a>
                              <a
                                  href="https://youtube.com/@paymefansshop"
                                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 transition-colors"
                                  aria-label="Youtube"
                              >
                                  <Youtube className="w-5 h-5" />
                              </a>
                          </div>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200 dark:border-slate-800">
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <a
                              href="#"
                              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                              Terms
                          </a>
                          <a
                              href="#"
                              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                              Privacy
                          </a>
                          <a
                              href="#"
                              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                              Support
                          </a>
                          <a
                              href="#"
                              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                              Contact
                          </a>
                      </div>
                  </div>
              </div>
          </aside>
      </>
  );
}
