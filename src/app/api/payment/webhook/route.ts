import { NextResponse } from "next/server";
import OrderService from "@/server/OrderService";

export async function POST(request: Request) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const payload = JSON.parse(body);

    // Get Paystack signature from headers
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing signature",
        },
        { status: 400 },
      );
    }

    // Handle webhook
    const result = await OrderService.handlePaystackWebhook(payload, signature);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      {
        error: false,
        message: "Webhook processed successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in POST /api/payment/webhook:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to process webhook",
      },
      { status: 500 },
    );
  }
}
