"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Heart, Package } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  const navItems = [
    {
      href: "/",
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                item.active
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-600 rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
