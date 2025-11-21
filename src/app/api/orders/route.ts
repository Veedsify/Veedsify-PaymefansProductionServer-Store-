import { NextResponse } from "next/server";
import { auth } from "@auth";
import OrderService from "@/server/OrderService";
import { config } from "@/utils/config";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized. Please login to continue",
        },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);
    const result = await OrderService.getUserOrders(userId);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    // Format orders with CloudFront URLs
    const formattedOrders = result?.data;

    return NextResponse.json(
      {
        error: false,
        message: "Orders retrieved successfully",
        data: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to retrieve orders",
      },
      { status: 500 }
    );
  }
}
