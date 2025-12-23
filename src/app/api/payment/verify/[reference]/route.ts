import { NextResponse } from "next/server";
import { auth } from "@auth";
import OrderService from "@/server/OrderService";
import { config } from "@/utils/config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized. Please login to continue",
        },
        { status: 401 },
      );
    }

    const { reference } = await params;

    if (!reference) {
      return NextResponse.json(
        {
          error: true,
          message: "Payment reference is required",
        },
        { status: 400 },
      );
    }

    const userId = Number(session.user.id);

    // Verify payment and update order
    const result = await OrderService.verifyPayment(reference, userId);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    // Format order data with CloudFront URLs
    if (result.data?.order) {
      const formattedOrder = {
        ...result.data.order,
        shipping_address:
          typeof result.data.order.shipping_address === "string"
            ? JSON.parse(result.data.order.shipping_address)
            : result.data.order.shipping_address,
        items: result.data.order.items.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            images: item.product.images.map((img: any) => ({
              ...img,
              image_url: `${config.cloudFrontUrl}/${img.image_url}`,
            })),
          },
        })),
      };

      return NextResponse.json(
        {
          error: false,
          message: result.message,
          data: {
            ...result.data,
            order: formattedOrder,
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/payment/verify/[reference]:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to verify payment",
      },
      { status: 500 },
    );
  }
}
