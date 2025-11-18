import { NextResponse } from "next/server";
import { auth } from "@auth";
import OrderService from "@/server/OrderService";
import { config } from "@/utils/config";

export async function GET(
  request: Request,
  { params }: { params: { orderid: string } }
) {
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

    const { orderid } = params;

    if (!orderid) {
      return NextResponse.json(
        {
          error: true,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);
    const result = await OrderService.getOrder(orderid, userId);

    if (result.error) {
      return NextResponse.json(result, { status: 404 });
    }

    // Format order with CloudFront URLs
    const formattedOrder = {
      ...result.data,
      items: result?.data?.items.map((item: any) => ({
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
        data: formattedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/orders/[orderid]:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to retrieve order",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderid: string } }
) {
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

    const { orderid } = params;
    const body = await request.json();
    const { status } = body;

    if (!orderid) {
      return NextResponse.json(
        {
          error: true,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        {
          error: true,
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: true,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);
    const result = await OrderService.updateOrderStatus(
      orderid,
      userId,
      status
    );

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in PATCH /api/orders/[orderid]:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to update order status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderid: string } }
) {
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

    const { orderid } = params;

    if (!orderid) {
      return NextResponse.json(
        {
          error: true,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);
    const result = await OrderService.cancelOrder(orderid, userId);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE /api/orders/[orderid]:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to cancel order",
      },
      { status: 500 }
    );
  }
}
