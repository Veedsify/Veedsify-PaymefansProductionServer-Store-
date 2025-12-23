export { auth as proxy } from "@auth";

export const config = {
  matcher: [
    "/store/:path*",
    "/category/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/payment/:path*",
    "/product/:path*",
    "/wishlist/:path*",
  ],
};
