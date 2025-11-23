"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Heart, Package } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function BottomNav() {
  const pathname = usePathname();
  
  // Subscribe to store changes reactively - this will cause re-render when counts change
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getWishlistCount());

  const navItems = [
    {
      href: "/store",
      icon: Home,
      label: "Store",
      active: pathname === "/store",
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-800 md:hidden safe-area-inset-bottom">
      <div className="grid h-14 grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
                item.active
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-pink-600 rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
