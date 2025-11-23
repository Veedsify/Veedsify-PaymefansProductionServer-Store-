import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import ThemeInitializer from "@/components/ThemeInitializer";
import { QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "@/utils/queryClient";
import { UserProvider } from "@/contexts/userContext";
import { Toaster } from "react-hot-toast";
import { auth } from "@auth";
import { redirect } from "next/navigation";
import StoreSyncProvider from "@/components/StoreSyncProvider";
const font = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Paymefans Store - Shop Exclusive Merchandise",
    description:
        "Paymefans store is a platform where you can buy products and merchandise from your favorite models. We offer a wide range of products, including clothing, accessories, and more.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session) {
        redirect("/");
    }
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
                className={`${font.className} font-sans antialiased bg-white dark:bg-gray-900 flex flex-col min-h-screen`}
            >
                <QueryProvider>
                    <UserProvider>
                        <StoreSyncProvider />
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
                        <ThemeInitializer />
                        <Navbar />
                        <main className="flex-1 pb-14 md:pb-0">{children}</main>
                        <Footer />
                        <BottomNav />
                    </UserProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
