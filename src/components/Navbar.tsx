"use client";
import Link from "next/link";
import {
  Moon,
  Sun,
  Home,
  ShoppingCart,
  Heart,
  Package,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import Image from "next/image";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  if (!mounted) return null;

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  const navItems = [
    {
      href: "/store",
      icon: Home,
      label: "Store",
      active: pathname === "/",
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: "Wishlist",
      active: pathname === "/wishlist",
      badge: wishlistCount,
    },
    {
      href: "/cart",
      icon: ShoppingCart,
      label: "Cart",
      active: pathname === "/cart",
      badge: cartCount,
    },
    {
      href: "/orders",
      icon: Package,
      label: "Orders",
      active: pathname === "/orders",
    },
  ];

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-700">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 cursor-pointer text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={"/logos/logo1.svg"}
                  alt="Logo"
                  width={150}
                  height={40}
                  className="h-10"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="items-center hidden gap-6 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.badge && item.badge > 0 ? (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-600 rounded-full">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      ) : null}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
