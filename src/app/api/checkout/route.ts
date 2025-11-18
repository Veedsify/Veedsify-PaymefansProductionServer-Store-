import { NextResponse } from "next/server";
import { auth } from "@auth";
import OrderService from "@/server/OrderService";

export async function POST(request: Request) {
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

        const body = await request.json();
        const { items, shipping_address, payment_method } = body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Cart is empty",
                },
                { status: 400 }
            );
        }

        if (!shipping_address) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Shipping address is required",
                },
                { status: 400 }
            );
        }

        // Validate shipping address fields
        const requiredAddressFields = [
            "name",
            "phone",
            "address",
            "city",
            "state",
            "country",
        ];
        for (const field of requiredAddressFields) {
            if (!shipping_address[field]) {
                return NextResponse.json(
                    {
                        error: true,
                        message: `Shipping ${field} is required`,
                    },
                    { status: 400 }
                );
            }
        }

        // Validate payment method
        if (payment_method !== "paystack") {
            return NextResponse.json(
                {
                    error: true,
                    message: "Invalid payment method. Only paystack is supported",
                },
                { status: 400 }
            );
        }

        // Validate items structure
        for (const item of items) {
            if (!item.product_id || !item.quantity) {
                return NextResponse.json(
                    {
                        error: true,
                        message: "Invalid item format. product_id and quantity are required",
                    },
                    { status: 400 }
                );
            }

            if (item.quantity < 1) {
                return NextResponse.json(
                    {
                        error: true,
                        message: "Item quantity must be at least 1",
                    },
                    { status: 400 }
                );
            }
        }

        const userId = Number(session.user.id);

        // Process checkout
        const result = await OrderService.processCheckout({
            userId,
            items,
            shipping_address,
            payment_method,
        });

        if (result.error) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("Error in POST /api/checkout:", error);
        return NextResponse.json(
            {
                error: true,
                message: error.message || "Failed to process checkout",
            },
            { status: 500 }
        );
    }
}
