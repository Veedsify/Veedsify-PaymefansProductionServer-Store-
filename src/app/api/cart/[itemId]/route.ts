import { NextResponse } from "next/server";
import { auth } from "@auth";
import CartService from "@/server/CartService";
import { config } from "@/utils/config";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
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

    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing required field: quantity",
        },
        { status: 400 },
      );
    }

    const userId = Number(session.user.id);
    const cartItemId = Number((await params).itemId);

    const result = await CartService.updateCartItem({
      userId,
      cartItemId,
      quantity,
    });

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    // Format the response with CloudFront URLs if data exists
    if (result.data) {
      const formattedData = {
        id: result.data.id,
        quantity: result.data.quantity,
        selectedSize: result.data.size.name,
        sizeId: result.data.size_id,
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
          images: result.data.product.images.map((img: any) => ({
            id: img.id,
            image_url: `${config.cloudFrontUrl}/${img.image_url}`,
          })),
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
        { status: 200 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/cart/[itemId]:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Failed to update cart item",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
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
    const cartItemId = Number((await params).itemId);

    const result = await CartService.removeFromCart({
      userId,
      cartItemId,
    });

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/cart/[itemId]:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Failed to remove cart item",
      },
      { status: 500 },
    );
  }
}
