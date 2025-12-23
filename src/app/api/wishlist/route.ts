import { NextResponse } from "next/server";
import { auth } from "@auth";
import WishlistService from "@/server/WishlistService";
import { config } from "@/utils/config";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    const result = await WishlistService.getWishlist(userId);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    // Check if data exists and is an array
    if (!result.data || !Array.isArray(result.data)) {
      return NextResponse.json(
        {
          error: false,
          message: "Wishlist retrieved successfully",
          data: [],
        },
        { status: 200 },
      );
    }

    // Format wishlist items with CloudFront URLs
    const formattedData = result.data.map((item: any) => ({
      id: item.id,
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
        images: item.product.images,
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
        message: "Wishlist retrieved successfully",
        data: formattedData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in GET /api/wishlist:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to retrieve wishlist",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing required field: productId",
        },
        { status: 400 },
      );
    }

    const userId = Number(session.user.id);

    const result = await WishlistService.addToWishlist({
      userId,
      productId: Number(productId),
    });

    if (result.error) {
      console.error("Wishlist service error:", result.message);
      return NextResponse.json(result, { status: 400 });
    }

    // Format the response with CloudFront URLs
    if (result.data) {
      const formattedData = {
        id: result.data.id,
        product: {
          id: result.data.product.id,
          name: result.data.product.name,
          description: result.data.product.description,
          price: result.data.product.price,
          instock: result.data.product.instock,
          product_id: result.data.product.product_id,
          category: {
            name: result.data.product.category.name,
          },
          images: result.data.product.images,
          sizes: result.data.product.sizes.map((s: any) => ({
            size: {
              id: s.size.id,
              name: s.size.name,
            },
          })),
        },
      };

      return NextResponse.json(
        {
          error: false,
          message: result.message,
          data: formattedData,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/wishlist:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to add item to wishlist",
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    const result = await WishlistService.clearWishlist(userId);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE /api/wishlist:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to clear wishlist",
      },
      { status: 500 },
    );
  }
}
