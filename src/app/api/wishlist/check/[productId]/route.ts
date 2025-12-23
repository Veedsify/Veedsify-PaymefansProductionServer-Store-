import { NextResponse } from "next/server";
import { auth } from "@auth";
import WishlistService from "@/server/WishlistService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
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
    const productId = Number((await params).productId);

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid product ID",
        },
        { status: 400 },
      );
    }

    const result = await WishlistService.isInWishlist(userId, productId);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      {
        error: false,
        message: "Wishlist check completed",
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in GET /api/wishlist/check/[productId]:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to check wishlist",
      },
      { status: 500 },
    );
  }
}
