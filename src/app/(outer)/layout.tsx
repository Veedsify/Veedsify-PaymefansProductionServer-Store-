import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "../globals.css";
import ThemeInitializer from "@/components/ThemeInitializer";
import QueryProvider from "@/utils/queryClient";
import { UserProvider } from "@/contexts/userContext";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const font = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Paymefans Store - Shop Exclusive Merchandise",
  description:
    "Paymefans store is a platform where you can buy products and merchandise from your favorite models. We offer a wide range of products, including clothing, accessories, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/paymefans-icon.png" />
        <link
          rel="apple-touch-icon"
          href="/icons/paymefans-icon.png"
          sizes="180x180"
        />
        <meta name="theme-color" content="#000000" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="description"
          content="Paymefans - The Ultimate Fan Experience"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta property="og:image" content="/site/logo.svg" />
      </head>
      <body
        className={`${font.className} font-sans antialiased bg-white dark:bg-gray-950 flex flex-col min-h-dvh`}
      >
        <ThemeInitializer />
        <QueryProvider>
          <UserProvider>
            <Toaster
              toastOptions={{
                duration: 5000,
                style: {
                  fontSize: "14px",
                  fontWeight: "500",
                  border: "1px solid #CC0DF8",
                  borderRadius: "100vmax",
                },
                className:
                  "dark:bg-gray-900 dark:text-white dark:border-gray-600",
              }}
            />
        
            <main className="flex-1 md:pb-0 ">{children}</main>
            {/* Footer with Terms and Privacy Links */}
            <footer className="w-full bg-black border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col items-center justify-center gap-4 sm:gap-5">
                  {/* Links */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
                    <Link
                      href="/pages/store-privacy-policy"
                      className="text-xs sm:text-sm text-gray-300 hover:text-primary-dark-pink dark:hover:text-pink-400 transition-colors duration-200 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </div>

                  {/* Copyright */}
                  <div className="pt-2 border-t border-white/10 w-full max-w-md">
                    <p className="text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                      &copy; {new Date().getFullYear()} Media Setroom Ltd. All
                      rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
