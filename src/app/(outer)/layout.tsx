import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "../globals.css";
import ThemeInitializer from "@/components/ThemeInitializer";
import QueryProvider from "@/utils/queryClient";
import { UserProvider } from "@/contexts/userContext";

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
        className={`${font.className} font-sans antialiased bg-white dark:bg-gray-950 flex flex-col min-h-screen`}
      >
        <ThemeInitializer />
        <QueryProvider>
          <UserProvider>
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
