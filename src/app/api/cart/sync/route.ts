import { NextResponse } from "next/server";
import { auth } from "@auth";
import CartService from "@/server/CartService";
import { config } from "@/utils/config";

export async function POST(request: Request) {
    try {
      const session = await auth();

      if (!session || !session.user) {
        return NextResponse.json(
          {
            error: true,
            message: "Unauthorized",
          },
          { status: 401 }
        );
      }

      const body = await request.json();
      const { cartItems } = body;

      if (!Array.isArray(cartItems)) {
        return NextResponse.json(
          {
            error: true,
            message: "Invalid cart items format",
          },
          { status: 400 }
        );
      }

      const userId = Number(session.user.id);

      // Transform cart items to match backend format
      const transformedItems = cartItems.map((item) => ({
        product: {
          id: item.product.id,
        },
        quantity: item.quantity,
        sizeId: item.sizeId || item.product.sizes[0]?.size?.id,
      }));

      const result = await CartService.syncCart(userId, transformedItems);

      if (result.error) {
        return NextResponse.json(result, { status: 400 });
      }

      // Check if data exists and is an array
      if (result.error || !result.data || !Array.isArray(result.data)) {
        return NextResponse.json(
          {
            error: false,
            message: "Cart synced successfully",
            data: [],
          },
          { status: 200 }
        );
      }

      // Format cart items with CloudFront URLs
      const formattedData = result?.data?.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        selectedSize: item.size.name,
        sizeId: item.size_id,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          instock: item.product.instock,
          product_id: item.product.product_id,
          category: {
            name: item.product.category.name,
          },
          images: item.product.images.map((img: any) => ({
            id: img.id,
            image_url: `${config.cloudFrontUrl}/${img.image_url}`,
          })),
          sizes: item.product.sizes.map((s: any) => ({
            size: {
              id: s.size.id,
              name: s.size.name,
            },
          })),
        },
      }));

      return NextResponse.json(
        {
          error: false,
          message: "Cart synced successfully",
          data: formattedData,
        },
        { status: 200 }
      );
    } catch (error: any) {
        console.error("Error in POST /api/cart/sync:", error);
        return NextResponse.json(
            {
                error: true,
                message: error.message || "Failed to sync cart",
            },
            { status: 500 },
        );
    }
}
